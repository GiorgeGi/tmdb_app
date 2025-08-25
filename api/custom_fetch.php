<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_auth.php';

list($ok, $user_id, $err) = require_auth($pdo);
if (!$ok) {
    echo json_encode(["success" => false, "message" => $err]);
    exit;
}

$id = intval($_GET['id'] ?? 0);

$stmt = $pdo->prepare("SELECT * FROM custom_items WHERE id=? AND user_id=?");
$stmt->execute([$id, $user_id]);
$item = $stmt->fetch(PDO::FETCH_ASSOC);

if ($item) {
    echo json_encode(["success" => true, "item" => $item]);
} else {
    echo json_encode(["success" => false, "message" => "Item not found"]);
}

