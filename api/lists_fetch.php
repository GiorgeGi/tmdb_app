<?php
// api/lists_fetch.php
require_once __DIR__ . '/_config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated"]);
    exit;
}

$userId = (int)$_SESSION['user_id'];

// Select user_items and join custom_items if any
$stmt = $pdo->prepare("
    SELECT ui.*,
           ci.title AS custom_title,
           ci.description AS custom_description,
           ci.image_url AS custom_image_url,
           ci.type AS custom_type
    FROM user_items ui
    LEFT JOIN custom_items ci ON ui.custom_id = ci.id
    WHERE ui.user_id = :uid
    ORDER BY ui.updated_at DESC
");
$stmt->execute(['uid' => $userId]);

$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "items" => $items
]);

