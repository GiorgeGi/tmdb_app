<?php
// api/lists_fetch.php
require_once __DIR__ . '/_config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated"]);
    exit;
}

$userId = (int)$_SESSION['user_id'];

$stmt = $pdo->prepare("SELECT * FROM user_items WHERE user_id = :uid ORDER BY updated_at DESC");
$stmt->execute(['uid' => $userId]);

echo json_encode([
    "success" => true,
    "items" => $stmt->fetchAll(PDO::FETCH_ASSOC)
]);

