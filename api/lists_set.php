<?php
// api/lists_set.php
// Handles adding a movie or TV show to a user's watchlist/favorites/watched list

require_once __DIR__ . '/_auth.php';

// Authenticate the user (session or bearer token)
[$ok, $userId, $err] = require_auth($pdo);
if (!$ok) {
    http_response_code(401);
    echo json_encode(['error' => $err]);
    exit;
}

// Read JSON payload safely
$input = read_json_body();

// Extract expected parameters from input
$type         = strtolower(trim($input['type'] ?? ''));                  // "movie" or "tv"
$tmdb_id      = isset($input['tmdb_id']) && $input['tmdb_id'] !== '' ? (int)$input['tmdb_id'] : null;
$listName     = trim($input['list'] ?? '');                              // "Favorites" | "Watchlist" | "Watched"
$title        = trim($input['title'] ?? '');
$poster_path  = isset($input['poster_path']) ? trim($input['poster_path']) : null;
$overview     = isset($input['overview']) ? trim($input['overview']) : null;
$year         = isset($input['year']) ? trim($input['year']) : null;
$first_air    = isset($input['first_air_date']) ? trim($input['first_air_date']) : null;

// Validate type, list, and title
$validTypes = ['movie','tv'];
$validLists = ['Favorites','Watchlist','Watched'];
if (!in_array($type, $validTypes, true) || !in_array($listName, $validLists, true) || !$title) {
    http_response_code(422);
    echo json_encode(['error' => 'Invalid payload']);
    exit;
}

// Begin transaction to ensure atomicity
$pdo->beginTransaction();

try {
    // Ensure the target watchlist exists for this user
    $st = $pdo->prepare("SELECT id FROM watchlists WHERE user_id = :uid AND name = :name");
    $st->execute(['uid' => $userId, 'name' => $listName]);
    $wlId = $st->fetchColumn();

    if (!$wlId) {
        // Create the watchlist if it doesn't exist
        $ins = $pdo->prepare("INSERT INTO watchlists (user_id, name) VALUES (:uid, :name)");
        $ins->execute(['uid' => $userId, 'name' => $listName]);
        $wlId = (int)$pdo->lastInsertId();
    }

    // Prepare IDs for movie or TV show
    $movieId = null;
    $tvId    = null;

    // Upsert into movies or tv_shows tables
    if ($type === 'movie') {
        // Check if movie already exists by TMDB ID
        if ($tmdb_id) {
            $s = $pdo->prepare("SELECT id FROM movies WHERE tmdb_id = :t");
            $s->execute(['t' => $tmdb_id]);
            $movieId = $s->fetchColumn();
        }

        if (!$movieId) {
            // Insert new movie
            $ins = $pdo->prepare("
                INSERT INTO movies (tmdb_id, title, year, poster_path, overview, is_custom)
                VALUES (:tmdb, :title, :year, :poster, :ov, 0)
            ");
            $ins->execute([
                'tmdb'   => $tmdb_id,
                'title'  => $title,
                'year'   => $year ?: null,
                'poster' => $poster_path,
                'ov'     => $overview,
            ]);
            $movieId = (int)$pdo->lastInsertId();
        } else {
            // Update existing movie metadata if provided
            $upd = $pdo->prepare("
                UPDATE movies
                   SET title = COALESCE(NULLIF(:title,''), title),
                       year = COALESCE(NULLIF(:year,''), year),
                       poster_path = COALESCE(NULLIF(:poster,''), poster_path),
                       overview = COALESCE(NULLIF(:ov,''), overview)
                 WHERE id = :id
            ");
            $upd->execute([
                'title'  => $title,
                'year'   => $year,
                'poster' => $poster_path,
                'ov'     => $overview,
                'id'     => $movieId
            ]);
        }

    } else { // TV show
        // Check if TV show already exists
        if ($tmdb_id) {
            $s = $pdo->prepare("SELECT id FROM tv_shows WHERE tmdb_id = :t");
            $s->execute(['t' => $tmdb_id]);
            $tvId = $s->fetchColumn();
        }

        if (!$tvId) {
            // Insert new TV show
            $ins = $pdo->prepare("
                INSERT INTO tv_shows (tmdb_id, title, first_air_date, poster_path, overview, is_custom)
                VALUES (:tmdb, :title, :fad, :poster, :ov, 0)
            ");
            $ins->execute([
                'tmdb'   => $tmdb_id,
                'title'  => $title,
                'fad'    => $first_air ?: null,
                'poster' => $poster_path,
                'ov'     => $overview,
            ]);
            $tvId = (int)$pdo->lastInsertId();
        } else {
            // Update existing TV show metadata if provided
            $upd = $pdo->prepare("
                UPDATE tv_shows
                   SET title = COALESCE(NULLIF(:title,''), title),
                       first_air_date = COALESCE(NULLIF(:fad,''), first_air_date),
                       poster_path = COALESCE(NULLIF(:poster,''), poster_path),
                       overview = COALESCE(NULLIF(:ov,''), overview)
                 WHERE id = :id
            ");
            $upd->execute([
                'title'  => $title,
                'fad'    => $first_air,
                'poster' => $poster_path,
                'ov'     => $overview,
                'id'     => $tvId
            ]);
        }
    }

    // Helper function to get watchlist ID by name, create if not exists
    $getListId = function(string $name) use ($pdo, $userId): int {
        $q = $pdo->prepare("SELECT id FROM watchlists WHERE user_id = :uid AND name = :name");
        $q->execute(['uid' => $userId, 'name' => $name]);
        $id = $q->fetchColumn();
        if ($id) return (int)$id;

        $ins = $pdo->prepare("INSERT INTO watchlists (user_id, name) VALUES (:uid, :name)");
        $ins->execute(['uid' => $userId, 'name' => $name]);
        return (int)$pdo->lastInsertId();
    };

    // Enforce exclusivity between Watchlist and Watched
    if ($listName === 'Watched') {
        $watchlistId = $getListId('Watchlist');
        $del = $pdo->prepare("
            DELETE FROM watchlist_items
             WHERE watchlist_id = :wid
               AND ".($type === 'movie' ? "movie_id = :mid" : "tv_show_id = :tid")."
        ");
        $del->execute([
            'wid' => $watchlistId,
            $type === 'movie' ? 'mid' : 'tid' => $type === 'movie' ? $movieId : $tvId
        ]);
    } elseif ($listName === 'Watchlist') {
        $watchedId = $getListId('Watched');
        $del = $pdo->prepare("
            DELETE FROM watchlist_items
             WHERE watchlist_id = :wid
               AND ".($type === 'movie' ? "movie_id = :mid" : "tv_show_id = :tid")."
        ");
        $del->execute([
            'wid' => $watchedId,
            $type === 'movie' ? 'mid' : 'tid' => $type === 'movie' ? $movieId : $tvId
        ]);
    }

    // Check if the item already exists in target list
    $exists = $pdo->prepare("
       SELECT id FROM watchlist_items
        WHERE watchlist_id = :wl
          AND ".($type === 'movie' ? "movie_id = :mid" : "tv_show_id = :tid")."
        LIMIT 1
    ");
    $exists->execute([
        'wl' => $wlId,
        $type === 'movie' ? 'mid' : 'tid' => $type === 'movie' ? $movieId : $tvId
    ]);
    $existingItemId = $exists->fetchColumn();

    $status = ($listName === 'Watched') ? 'seen' : 'pending';

    if ($existingItemId) {
        // Update status if already exists
        $upd = $pdo->prepare("UPDATE watchlist_items SET status = :st WHERE id = :id");
        $upd->execute(['st' => $status, 'id' => $existingItemId]);
    } else {
        // Insert new record
        $ins = $pdo->prepare("
            INSERT INTO watchlist_items (watchlist_id, movie_id, tv_show_id, status)
            VALUES (:wl, :mid, :tid, :st)
        ");
        $ins->execute([
            'wl'  => $wlId,
            'mid' => $type === 'movie' ? $movieId : null,
            'tid' => $type === 'tv'    ? $tvId    : null,
            'st'  => $status
        ]);
    }

    // Commit transaction
    $pdo->commit();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    // Rollback on error
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Failed to add item']);
}

