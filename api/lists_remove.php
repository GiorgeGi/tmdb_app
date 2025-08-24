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
$type    = $input['type'] ?? null;
$tmdb_id = intval($input['tmdb_id'] ?? 0);

if (!$type || !$tmdb_id) {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

$stmt = $pdo->prepare("DELETE FROM user_items WHERE user_id=? AND tmdb_id=? AND type=?");
$ok = $stmt->execute([$user_id, $tmdb_id, $type]);

if ($ok) {
    echo json_encode(['success' => true, 'message' => 'Item deleted']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete']);
}

