<?php
$result = new stdClass();
$result->success = false;
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $result->room = 'general';
    $result->user =
    $result->messages = array();
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode($result);