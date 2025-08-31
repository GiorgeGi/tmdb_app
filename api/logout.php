<?php
// api/logout.php
// Handles user logout: deletes token and destroys session

require_once __DIR__ . '/_config.php';

// Check for Bearer token in Authorization header
$auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (preg_match('/Bearer\s+([A-Fa-f0-9]{32})/', $auth, $m)) {
    $token = $m[1];
    try {
        // Remove token from DB to invalidate it
        $pdo->prepare("DELETE FROM auth_tokens WHERE token = :t")->execute(['t' => $token]);
    } catch (Exception $e) {
        // Ignore any errors during token deletion
    }
}

// Destroy session if active
if (session_status() === PHP_SESSION_ACTIVE) {
    $_SESSION = [];
    session_destroy();
}

// Return success response
echo json_encode(['success' => true]);

