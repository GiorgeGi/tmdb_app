<?php
// Start a session to track the logged-in user
session_start();

// Set response content type to JSON
header("Content-Type: application/json");

// Include configuration file (DB connection, etc.)
require_once __DIR__ . '/_config.php';

// Include authentication utilities (login checks, helpers)
require_once __DIR__ . '/_auth.php';

// Check if the user is logged in by verifying session
if (!isset($_SESSION['user_id'])) {
    // Respond with JSON error and stop execution
    echo json_encode(["success" => false, "error" => "Not logged in"]);
    exit;
}

// Get the JSON input from the request body and decode it to an associative array
$input = json_decode(file_get_contents("php://input"), true);

// Extract and sanitize input fields
$title = trim($input['title'] ?? "");             // Movie/TV title
$description = trim($input['description'] ?? ""); // Optional description
$image_url = trim($input['image_url'] ?? "");     // Optional image URL
$type = $input['type'] ?? null;                   // Type: "movie" or "tv"
$list_type = $input['list_type'] ?? "watchlist";  // List type, defaults to "watchlist"

// Validate required input
if ($title === "" || !$type || !in_array($type, ["movie", "tv"])) {
    // Respond with JSON error and stop execution
    echo json_encode(["success" => false, "error" => "Invalid input"]);
    exit;
}

try {
    // Begin a transaction to ensure both inserts succeed or fail together
    $pdo->beginTransaction();

    // Insert new custom item into the custom_items table
    $stmt = $pdo->prepare(
        "INSERT INTO custom_items (user_id, title, description, image_url, type) 
         VALUES (?, ?, ?, ?, ?)"
    );
    // Execute the prepared statement with user data
    $stmt->execute([$_SESSION['user_id'], $title, $description, $image_url, $type]);

    // Get the ID of the newly inserted custom item
    $customId = $pdo->lastInsertId();

    // Insert a reference into user_items to track the list type for this user
    $stmt = $pdo->prepare(
        "INSERT INTO user_items (user_id, custom_id, list_type) VALUES (?, ?, ?)"
    );
    $stmt->execute([$_SESSION['user_id'], $customId, $list_type]);

    // Commit the transaction after both inserts are successful
    $pdo->commit();

    // Respond with success and return the custom item's ID
    echo json_encode(["success" => true, "custom_id" => $customId]);

} catch (Exception $e) {
    // Roll back the transaction in case of any errors
    $pdo->rollBack();

    // Respond with JSON error message
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

