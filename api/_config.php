<?php
// api/_config.php

// ---- CORS (Cross-Origin Resource Sharing) ----
// Get the Origin header from the request
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Define the list of allowed origins
$allowedOrigins = [
    'http://localhost:3000',  // React dev server
    'http://127.0.0.1:3000',  // alternative localhost
    'http://localhost',        // direct API calls from same machine
];

// If the request origin is allowed, send CORS headers
if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: $origin"); // Allow this origin
    header("Access-Control-Allow-Credentials: true"); // Allow cookies
}

// Allow specific headers and HTTP methods
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');

// For preflight OPTIONS requests, exit immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}


// ---- Content type ----
// All responses are JSON encoded with UTF-8 charset
header('Content-Type: application/json; charset=utf-8');


// ---- Sessions (cookie-based authentication) ----
// Configure session cookies
ini_set('session.cookie_domain', 'localhost'); // Use your domain; 'None' for HTTPS cross-site
session_set_cookie_params([
    'lifetime' => 60*60*24*7, // 7 days
    'path'     => '/',         // available to entire site
    'secure'   => false,       // true if using HTTPS
    'httponly' => true,        // inaccessible to JS
    'samesite' => 'Lax',       // prevents some CSRF attacks
]);

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


// ---- Database connection ----
// DB credentials
define('DB_HOST', 'localhost');
define('DB_NAME', 'tmdb_app');
define('DB_USER', 'root');
define('DB_PASS', '');

// Attempt to connect to MySQL using PDO
try {
    $pdo = new PDO(
        "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION] // throw exceptions on errors
    );
} catch (Exception $e) {
    // If DB connection fails, return 500 error as JSON
    http_response_code(500);
    echo json_encode(['error' => 'Database connect error']);
    exit;
}


// ---- Helper function to read JSON body from POST requests ----
function read_json_body(): array {
    $raw = file_get_contents('php://input'); // read raw request body
    if ($raw === '' || $raw === false) return []; // empty or failed
    $data = json_decode($raw, true); // decode JSON into associative array
    return is_array($data) ? $data : []; // ensure array
}

