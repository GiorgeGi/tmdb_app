<?php
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_auth.php';

list($ok, $user_id, $err) = require_auth($pdo);
if (!$ok) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => $err]);
    exit;
}

$input = read_json_body();
$type    = $input['type'] ?? null;        // movie | tv
$tmdb_id = intval($input['tmdb_id'] ?? 0);
$action  = $input['action'] ?? null;     // favorite | watchlist | watched
$note    = $input['note'] ?? null;

if (!$type || !$tmdb_id || !$action) {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

// Ensure item exists
$table = $type === "movie" ? "movies" : "tv_shows";
$stmt = $pdo->prepare("SELECT id FROM $table WHERE tmdb_id=?");
$stmt->execute([$tmdb_id]);
if (!$stmt->fetch()) {
    $pdo->prepare("INSERT INTO $table (tmdb_id, title) VALUES (?, 'Placeholder')")->execute([$tmdb_id]);
}

// Check if user_item exists
$stmt = $pdo->prepare("SELECT * FROM user_items WHERE user_id=? AND tmdb_id=? AND type=?");
$stmt->execute([$user_id, $tmdb_id, $type]);
$existing = $stmt->fetch(PDO::FETCH_ASSOC);

$fav = ($existing['is_favorite'] ?? 0) == 1 ? 0 : 1;
$list = $existing['list_type'] ?? null;

switch($action){
    case "favorite":
        $fav = $fav ? 0 : 1;
        break;
    case "watchlist":
    case "watched":
        $list = $action;
        break;
}

// Update or insert
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
    $pdo->prepare("INSERT INTO user_items (user_id, tmdb_id, type, is_favorite, list_type, note, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())")
        ->execute([$user_id, $tmdb_id, $type, $fav, $list, $note]);
}

echo json_encode(['success' => true, 'message' => 'Saved successfully!']);

