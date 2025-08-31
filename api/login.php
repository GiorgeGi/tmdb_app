<?php
// api/login.php
// Handles user login, creates a bearer token and session

require_once __DIR__ . '/_config.php';

// Read JSON body from request
$input    = read_json_body();
$username = trim($input['username'] ?? ''); // extract username
$password = $input['password'] ?? '';       // extract password

// Validate input
if (!$username || !$password) {
    http_response_code(422);
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

// Fetch user record from DB
$stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE username = :u");
$stmt->execute(['u' => $username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Verify password
if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
    exit;
}

// Create a 32-character hex token (16 bytes)
$token = bin2hex(random_bytes(16));

// Set expiration date for 7 days
$expires = (new DateTime('+7 days'))->format('Y-m-d H:i:s');

// Insert token into auth_tokens table
$pdo->prepare("
    INSERT INTO auth_tokens (user_id, token, expires_at)
    VALUES (:uid, :tkn, :exp)
")->execute([
    'uid' => (int)$user['id'],
    'tkn' => $token,
    'exp' => $expires
]);

// Also set session (for cookie-based authentication)
$_SESSION['user_id'] = (int)$user['id'];
session_write_close();

// Return token and user info as JSON
echo json_encode([
    'token'   => $token,
    'userId'  => (int)$user['id'],
    'expires' => $expires
]);

