<?php
// Include the configuration file which sets up DB connection and sessions
require_once __DIR__ . '/_config.php';

// Check if the user is logged in via session
if (!isset($_SESSION['user_id'])) {
    // If not logged in, return 401 Unauthorized and JSON error message
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Not authenticated"]);
    exit;
}

// Get the logged-in user's ID from session
$uid = $_SESSION['user_id'];

// Prepare SQL query to fetch all user_items for this user
$stmt = $pdo->prepare("SELECT * FROM user_items WHERE user_id = ?");
$stmt->execute([$uid]);

// Fetch all results as associative array
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Initialize result array with separate lists for each type
$result = [
    "favourites" => [],
    "watchlist"  => [],
    "watched"    => [],
];

// Loop through each row from the database and categorize it
foreach ($rows as $r) {
    // Add the item to the appropriate list based on its list_type
    $result[$r['list_type']][] = $r;
}

// Return the structured JSON response containing the categorized lists
echo json_encode($result);

