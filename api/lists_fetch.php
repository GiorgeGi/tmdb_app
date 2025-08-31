<?php
// api/lists_fetch.php

// Include the configuration file which sets up DB connection and sessions
require_once __DIR__ . '/_config.php';

// Check if the user is logged in via session
if (!isset($_SESSION['user_id'])) {
    // If not logged in, return 401 Unauthorized and JSON error message
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated"]);
    exit;
}

// Cast session user_id to integer for security
$userId = (int)$_SESSION['user_id'];

// Prepare SQL query to fetch all items from user_items table for this user
// Left join with custom_items to get custom item details if they exist
$stmt = $pdo->prepare("
    SELECT ui.*,                                 -- All columns from user_items
           ci.title AS custom_title,            -- Custom item title (if exists)
           ci.description AS custom_description, -- Custom item description
           ci.image_url AS custom_image_url,   -- Custom item image URL
           ci.type AS custom_type              -- Custom item type (movie/tv)
    FROM user_items ui
    LEFT JOIN custom_items ci ON ui.custom_id = ci.id
    WHERE ui.user_id = :uid                     -- Filter items by current user
    ORDER BY ui.updated_at DESC                 -- Most recently updated items first
");

// Execute query with bound parameter
$stmt->execute(['uid' => $userId]);

// Fetch all results as associative array
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return JSON response containing success status and items array
echo json_encode([
    "success" => true,
    "items" => $items
]);

