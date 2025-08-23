<?php
// api/_config.php

// ---- CORS ----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost',        // if you ever call API directly
];

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}


// ---- Content type ----
header('Content-Type: application/json; charset=utf-8');

// ---- Sessions (cookie-based) ----
ini_set('session.cookie_domain', 'localhost'); // change to 'None' if using HTTPS + cross-site
session_set_cookie_params([
    'lifetime' => 60*60*24*7, // 7 days
    'path'     => '/',
    'secure'   => false,      // set true in HTTPS
    'httponly' => true,
    'samesite' => 'Lax',
]);
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ---- DB ----
define('DB_HOST', 'localhost');
define('DB_NAME', 'tmdb_app');
define('DB_USER', 'root');
define('DB_PASS', '');

try {
    $pdo = new PDO(
        "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connect error']);
    exit;
}

// ---- Helper to read JSON safely (POST) ----
function read_json_body(): array {
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

