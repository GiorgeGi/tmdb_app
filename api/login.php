<?php
// api/login.php
require_once __DIR__ . '/_config.php';

// read JSON
$input    = read_json_body();
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if (!$username || !$password) {
    http_response_code(422);
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE username = :u");
$stmt->execute(['u' => $username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
    exit;
}

// create token (32 hex chars) & persist
$token = bin2hex(random_bytes(16));
$expires = (new DateTime('+7 days'))->format('Y-m-d H:i:s');
$pdo->prepare("
    INSERT INTO auth_tokens (user_id, token, expires_at)
    VALUES (:uid, :tkn, :exp)
")->execute([
    'uid' => (int)$user['id'],
    'tkn' => $token,
    'exp' => $expires
]);

// also set session (so you can use cookie-based auth too)
$_SESSION['user_id'] = (int)$user['id'];
session_write_close();

echo json_encode([
    'token'   => $token,
    'userId'  => (int)$user['id'],
    'expires' => $expires
]);

