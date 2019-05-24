<?php
require_once dirname(__DIR__) . '/../models/Model.php';
require_once dirname(__DIR__) . '/../models/ShoutboxManager.php';
require_once dirname(__DIR__) . '/../models/MessageManager.php';
require_once dirname(__DIR__) . '/../models/UserManager.php';

function is_connected()
{
    session_start();

    $result = new stdClass();
    $result->success = true;

    if (isset($_SESSION['user_id'])) {
        $user = UserManager::get($_SESSION['user_id']);
        if(is_null($user)) {
            $result->success = false;
            $result->msg_err = "Le compte sur lequel vous étiez connecté n'éxiste plus, vous allez être déconnecté.";
            return $result;
        }
        $result->user = $user;
    } else {
        $result->success = false;
    }
    return $result;
}
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode(is_connected());