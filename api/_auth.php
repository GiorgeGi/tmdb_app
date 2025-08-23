<?php
// api/_auth.php
require_once __DIR__ . '/_config.php';

// Ensure auth_tokens table exists (first run)
$pdo->exec("
CREATE TABLE IF NOT EXISTS auth_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_auth_tokens_user_id (user_id),
  UNIQUE KEY uniq_auth_tokens_token (token),
  CONSTRAINT fk_auth_tokens_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

function get_authorization_header(): string {
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!$hdr && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) $hdr = $headers['Authorization'];
    }
    return $hdr;
}

/**
 * Returns [bool $ok, ?int $userId, ?string $error]
 */
function require_auth(PDO $pdo): array {
    // 1) Session user?
    if (!empty($_SESSION['user_id'])) {
        return [true, (int)$_SESSION['user_id'], null];
    }

    // 2) Bearer token?
    $auth = get_authorization_header();
    if (preg_match('/Bearer\s+([A-Fa-f0-9]{32})/', $auth, $m)) {
        $token = $m[1];
        $stmt = $pdo->prepare("SELECT user_id FROM auth_tokens WHERE token = :tkn AND expires_at > NOW()");
        $stmt->execute(['tkn' => $token]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            return [true, (int)$row['user_id'], null];
        }
        return [false, null, 'Invalid or expired token'];
    }

    return [false, null, 'Not authenticated'];
}

