<?php
// signup.php
// Handles user registration

require_once __DIR__ . '/_config.php';

// Decode JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Extract fields and trim
$email    = trim($input['email']    ?? '');
$username = trim($input['username'] ?? '');
$password = $input['password']      ?? '';

// Validate required fields
if (!$email || !$password || !$username) {
    http_response_code(422); // Unprocessable Entity
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

// Check if email or username already exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email OR username = :username");
$stmt->execute(['email' => $email, 'username' => $username]);
if ($stmt->fetch()) {
    http_response_code(409); // Conflict
    echo json_encode(['error' => 'Email or username already taken']);
    exit;
}

// Hash the password securely
$hash = password_hash($password, PASSWORD_DEFAULT);

// Insert new user into database
$stmt = $pdo->prepare("
  INSERT INTO users (username, email, password_hash)
  VALUES (:username, :email, :hash)
");
$stmt->execute([
  'username' => $username,
  'email'    => $email,
  'hash'     => $hash
]);

// Return success
echo json_encode(['success' => true]);

