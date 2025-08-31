<?php
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_auth.php';

// Ensure the user is authenticated (session or Bearer token)
list($ok, $user_id, $err) = require_auth($pdo);
if (!$ok) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => $err]);
    exit;
}

// Read JSON payload
$input = read_json_body();
$type      = $input['type'] ?? null;           // "movie" or "tv"
$tmdb_id   = intval($input['tmdb_id'] ?? 0);
$custom_id = intval($input['custom_id'] ?? 0);
$action    = $input['action'] ?? null;        // "is_favorite" | "watchlist" | "watched" | "note"
$note      = $input['note'] ?? null;

// Validate input
if (!$type && !$custom_id) {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

// Select existing user_item if any
if ($custom_id) {
    $stmt = $pdo->prepare("SELECT * FROM user_items WHERE user_id=? AND custom_id=?");
    $stmt->execute([$user_id, $custom_id]);
} else {
    $stmt = $pdo->prepare("SELECT * FROM user_items WHERE user_id=? AND tmdb_id=? AND type=?");
    $stmt->execute([$user_id, $tmdb_id, $type]);
}
$existing = $stmt->fetch(PDO::FETCH_ASSOC);

// Ensure TMDB item exists in main table (movies or tv_shows)
if ($tmdb_id) {
    $table = $type === "movie" ? "movies" : "tv_shows";
    $stmt = $pdo->prepare("SELECT id FROM $table WHERE tmdb_id=?");
    $stmt->execute([$tmdb_id]);
    if (!$stmt->fetch()) {
        // Insert placeholder if not present
        $pdo->prepare("INSERT INTO $table (tmdb_id, title) VALUES (?, 'Placeholder')")->execute([$tmdb_id]);
    }
}

// Default values for favorite and list
$fav  = $existing['is_favorite'] ?? 0;
$list = $existing['list_type'] ?? null;

// Handle the requested action
switch ($action) {
    case "is_favorite":
        if (isset($input['is_favorite'])) {
            $fav = intval($input['is_favorite']); // explicit value
        } else {
            $fav = $fav ? 0 : 1; // toggle favorite
        }
        break;

    case "watchlist":
    case "watched":
        $list = $action; // move item to the specified list
        break;

    case "note":
        // only update the note, nothing else
        break;
}

// Update existing record or insert new one
if ($existing) {
    $sql = "UPDATE user_items SET is_favorite=?, list_type=?, updated_at=NOW()";
    $params = [$fav, $list];

    if ($note !== null) {
        $sql .= ", note=?";
        $params[] = $note;
    }

    $sql .= " WHERE id=?";
    $params[] = $existing['id'];
    $pdo->prepare($sql)->execute($params);
} else {
    $pdo->prepare("
        INSERT INTO user_items 
            (user_id, tmdb_id, type, custom_id, is_favorite, list_type, note, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ")->execute([$user_id, $tmdb_id ?: null, $type ?: null, $custom_id ?: null, $fav, $list, $note]);
}

// Return success message
echo json_encode(['success' => true, 'message' => 'Saved successfully!']);

