<?php
// Include configuration (DB, sessions, helpers) and authentication functions
require_once __DIR__ . '/_config.php';
require_once __DIR__ . '/_auth.php';

// Require authentication via session or Bearer token
list($ok, $user_id, $err) = require_auth($pdo);
if (!$ok) {
    // If not authenticated, return 401 Unauthorized with error message
    http_response_code(401);
    echo json_encode(["success" => false, "message" => $err]);
    exit;
}

// Read JSON input from POST body safely
$input = read_json_body();

// Extract parameters from input
$tmdb_id   = intval($input['tmdb_id'] ?? 0);   // TMDB movie/TV ID
$custom_id = intval($input['custom_id'] ?? 0); // Custom item ID
$type      = $input['type'] ?? null;           // "movie" or "tv"

// Validate that at least one ID is provided
if (!$tmdb_id && !$custom_id) {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

if ($custom_id) {
    // If deleting a custom item:

    // 1) Delete the item from the user's list first
    $stmt = $pdo->prepare("DELETE FROM user_items WHERE user_id=? AND custom_id=?");
    $stmt->execute([$user_id, $custom_id]);

    // 2) Delete the item itself from the custom_items table
    $stmt = $pdo->prepare("DELETE FROM custom_items WHERE id=? AND user_id=?");
    $stmt->execute([$custom_id, $user_id]);

} else {
    // If deleting a TMDB item from a list
    $stmt = $pdo->prepare("DELETE FROM user_items WHERE user_id=? AND tmdb_id=? AND type=?");
    $stmt->execute([$user_id, $tmdb_id, $type]);
}

// Return success message
echo json_encode(['success' => true, 'message' => 'Deleted successfully!']);

