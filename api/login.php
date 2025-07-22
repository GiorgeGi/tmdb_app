<?php
require __DIR__ . '/_config.php';

// read JSON
$username = trim($input['username'] ?? '');
$password = $input['password']   ?? '';

if (!$username || !$password) {
    http_response_code(422);
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

// SELECT by username, not email
$stmt = $pdo->prepare("
    SELECT id, password_hash 
      FROM users 
     WHERE username = :username
");
$stmt->execute(['username' => $username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
    exit;
}

// generate & return token
$token = bin2hex(random_bytes(16));
echo json_encode([
    'token'  => $token,
    'userId' => $user['id']
]);

