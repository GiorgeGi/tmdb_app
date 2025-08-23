<?php
require_once __DIR__ . '/_config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success"=>false,"message"=>"Not authenticated"]);
    exit;
}

$uid = $_SESSION['user_id'];
$stmt = $pdo->prepare("SELECT * FROM user_items WHERE user_id = ?");
$stmt->execute([$uid]);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$result = [
    "favourites" => [],
    "watchlist"  => [],
    "watched"    => [],
];

foreach ($rows as $r) {
    $result[$r['list_type']][] = $r;
}

echo json_encode($result);

