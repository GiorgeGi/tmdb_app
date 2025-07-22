<?php
// signup.php

// — shared configuration (DB connect + JSON parse)
require __DIR__ . '/_config.php';

$email    = trim($input['email']    ?? '');
$username = trim($input['username'] ?? '');
$password = $input['password']      ?? '';

if (!$email || !$password || !$username) {
    http_response_code(422);
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

// check uniqueness
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email OR username = :username");
$stmt->execute(['email'=>$email, 'username'=>$username]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['error' => 'Email or username already taken']);
    exit;
}

// insert user
$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("
  INSERT INTO users (username, email, password_hash)
  VALUES (:username, :email, :hash)
");
$stmt->execute([
  'username'=>$username,
  'email'   =>$email,
  'hash'    =>$hash
]);

echo json_encode(['success' => true]);

