<?php
// Set response content type to JSON with UTF-8 charset
header('Content-Type: application/json; charset=utf-8');

// Include configuration and authentication helpers
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_auth.php';

// Check if the user is authenticated (session or bearer token)
list($ok, $user_id, $err) = require_auth($pdo);
if (!$ok) {
    // If authentication fails, return JSON error message
    echo json_encode(["success" => false, "message" => $err]);
    exit;
}

// Get the item ID from query parameters, default to 0 if not provided
$id = intval($_GET['id'] ?? 0);

// Prepare and execute a query to fetch the item for this user
$stmt = $pdo->prepare("SELECT * FROM custom_items WHERE id=? AND user_id=?");
$stmt->execute([$id, $user_id]);

// Fetch the item as an associative array
$item = $stmt->fetch(PDO::FETCH_ASSOC);

// Return JSON response
if ($item) {
    // Item found
    echo json_encode(["success" => true, "item" => $item]);
} else {
    // Item not found
    echo json_encode(["success" => false, "message" => "Item not found"]);
}

