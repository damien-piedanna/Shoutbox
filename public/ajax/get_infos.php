<?php
require_once dirname(__DIR__) . '/../models/Model.php';
require_once dirname(__DIR__) . '/../models/ShoutboxManager.php';
require_once dirname(__DIR__) . '/../models/MessageManager.php';
require_once dirname(__DIR__) . '/../models/UserManager.php';

function get_infos()
{
    session_start();
    if (!isset($_SESSION['user_id']))
        exit();

    $result = new stdClass();
    $result->success = true;
    $result->user = UserManager::get($_SESSION['user_id']);
    $result->shoutboxid = UserManager::getShoutbox($_SESSION['user_id']);
    $result->shoutboxs = ShoutboxManager::getAll();
    $result->messages = MessageManager::getMessages($result->shoutboxid);

    return $result;
}
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode(get_infos());