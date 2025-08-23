<?php
// api/lists_remove.php
require_once __DIR__ . '/_config.php';
require_login();

$input = read_json_body();
$itemId = (int)($input['itemId'] ?? 0);

if (!$itemId) {
    echo json_encode(['success' => false, 'message' => 'Missing itemId']);
    exit;
}

$stmt = $pdo->prepare("DELETE FROM user_items WHERE id = :id AND user_id = :uid");
$stmt->execute(['id' => $itemId, 'uid' => $_SESSION['user_id']]);

echo json_encode(['success' => true]);

