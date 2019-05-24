<?php
require_once dirname(__DIR__) . '/../models/Model.php';
require_once dirname(__DIR__) . '/../models/ShoutboxManager.php';
require_once dirname(__DIR__) . '/../models/MessageManager.php';
require_once dirname(__DIR__) . '/../models/UserManager.php';

function change_shoutbox()
{
    session_start();
    if (!isset($_SESSION['user_id']))
        exit();

    $result = new stdClass();
    $result->success = false;

    $shoutboxs = ShoutboxManager::getAll();
    $shoutboxid = $_POST['id'];

    foreach ($shoutboxs as $shoutbox) {
        if ($shoutbox['id'] == $shoutboxid) {
            $result->success = true;
            UserManager::setShoutbox($shoutboxid, $_SESSION['user_id']);
            return $result;
        }
    }

    return $result;
}
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode(change_shoutbox());