<?php
// Include the configuration file for DB connection
require_once __DIR__ . '/_config.php';

// Ensure the `auth_tokens` table exists. This is useful for the first run.
$pdo->exec("
CREATE TABLE IF NOT EXISTS auth_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,              -- Unique ID for each token
  user_id INT NOT NULL,                           -- Reference to the user who owns this token
  token VARCHAR(64) NOT NULL,                     -- The actual token string (32-byte hex)
  expires_at DATETIME NOT NULL,                   -- Expiration datetime of the token
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
  INDEX idx_auth_tokens_user_id (user_id),        -- Index for faster lookups by user_id
  UNIQUE KEY uniq_auth_tokens_token (token),      -- Ensure token uniqueness
  CONSTRAINT fk_auth_tokens_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  -- Foreign key ensures token is deleted if user is deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

// Function to get the Authorization header from the HTTP request
function get_authorization_header(): string {
    // First, try the standard $_SERVER superglobal
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    // If not found and using Apache, check apache_request_headers()
    if (!$hdr && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) $hdr = $headers['Authorization'];
    }

    // Return the header string or empty if not found
    return $hdr;
}

/**
 * Check if a request is authenticated.
 * 
 * Returns an array: [bool $ok, ?int $userId, ?string $error]
 * - $ok: true if authenticated
 * - $userId: the authenticated user's ID
 * - $error: error message if not authenticated
 */
function require_auth(PDO $pdo): array {
    // 1) Check if user is logged in via session
    if (!empty($_SESSION['user_id'])) {
        return [true, (int)$_SESSION['user_id'], null];
    }

    // 2) Check for Bearer token in Authorization header
    $auth = get_authorization_header();
    // Look for "Bearer <32-char hex>" pattern
    if (preg_match('/Bearer\s+([A-Fa-f0-9]{32})/', $auth, $m)) {
        $token = $m[1];

        // Query the DB for a valid token that hasn't expired
        $stmt = $pdo->prepare(
            "SELECT user_id FROM auth_tokens WHERE token = :tkn AND expires_at > NOW()"
        );
        $stmt->execute(['tkn' => $token]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // If token found, return authenticated
        if ($row) {
            return [true, (int)$row['user_id'], null];
        }

        // Token invalid or expired
        return [false, null, 'Invalid or expired token'];
    }

    // No session, no valid token
    return [false, null, 'Not authenticated'];
}

