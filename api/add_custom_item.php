<?php
session_start();
header("Content-Type: application/json");
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_auth.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "Not logged in"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

$title = trim($input['title'] ?? "");
$description = trim($input['description'] ?? "");
$image_url = trim($input['image_url'] ?? "");
$type = $input['type'] ?? null; // "movie" or "tv"
$list_type = $input['list_type'] ?? "watchlist"; // default to watchlist

if ($title === "" || !$type || !in_array($type, ["movie", "tv"])) {
    echo json_encode(["success" => false, "error" => "Invalid input"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // Insert into custom_items
    $stmt = $pdo->prepare("INSERT INTO custom_items (user_id, title, description, image_url, type) 
                           VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$_SESSION['user_id'], $title, $description, $image_url, $type]);

    $customId = $pdo->lastInsertId();

    // Insert into user_items
    $stmt = $pdo->prepare("INSERT INTO user_items (user_id, custom_id, list_type) VALUES (?, ?, ?)");
    $stmt->execute([$_SESSION['user_id'], $customId, $list_type]);

    $pdo->commit();

    echo json_encode(["success" => true, "custom_id" => $customId]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

