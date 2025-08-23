<?php
// api/logout.php
require_once __DIR__ . '/_config.php';

$auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (preg_match('/Bearer\s+([A-Fa-f0-9]{32})/', $auth, $m)) {
    $token = $m[1];
    try {
        $pdo->prepare("DELETE FROM auth_tokens WHERE token = :t")->execute(['t' => $token]);
    } catch (Exception $e) { /* ignore */ }
}

if (session_status() === PHP_SESSION_ACTIVE) {
    $_SESSION = [];
    session_destroy();
}

echo json_encode(['success' => true]);

