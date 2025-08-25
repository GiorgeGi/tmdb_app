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
$tmdb_id   = intval($input['tmdb_id'] ?? 0);
$custom_id = intval($input['custom_id'] ?? 0);
$type      = $input['type'] ?? null;

if (!$tmdb_id && !$custom_id) {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

if ($custom_id) {
    // Delete from user_items first
    $stmt = $pdo->prepare("DELETE FROM user_items WHERE user_id=? AND custom_id=?");
    $stmt->execute([$user_id, $custom_id]);

    // Then delete from custom_items table itself
    $stmt = $pdo->prepare("DELETE FROM custom_items WHERE id=? AND user_id=?");
    $stmt->execute([$custom_id, $user_id]);

} else {
    $stmt = $pdo->prepare("DELETE FROM user_items WHERE user_id=? AND tmdb_id=? AND type=?");
    $stmt->execute([$user_id, $tmdb_id, $type]);
}

echo json_encode(['success' => true, 'message' => 'Deleted successfully!']);

