<?php
// api/_config.php

// Allow React on port 3000 to call this API
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

// Handle preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

header('Content-Type: application/json');
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

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

