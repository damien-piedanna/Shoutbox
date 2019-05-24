<?php
require_once dirname(__DIR__) . '/../models/Model.php';
require_once dirname(__DIR__) . '/../models/ShoutboxManager.php';
require_once dirname(__DIR__) . '/../models/MessageManager.php';
require_once dirname(__DIR__) . '/../models/UserManager.php';

function ban_user()
{
    session_start();
    if(!isset($_SESSION['user_id']))
        exit();

    $result = new stdClass();
    $result->success = true;

    if(!isset($_POST['userid']) || !isset($_POST['raison'])) {
        $result->success = false;
        $result->msg_err = "Informations manquantes !";
        return $result;
    }
    if($_SESSION['user_role'] == 'member') {
        $result->success = false;
        $result->msg_err = "Vous n'avez pas les permissions pour bannir.";
        return $result;
    }
    if($_POST['userid'] == $_SESSION['user_id']) {
        $result->success = false;
        $result->msg_err = "Vous ne pouvez pas vous bannir vous-même.";
        return $result;
    }

    $user = UserManager::get($_POST['userid']);
    if($user['role'] == "admin")
    {
        $result->success = false;
        $result->msg_err = "Vous ne pouvez pas bannir un admin.";
        return $result;
    }

    UserManager::ban($_POST['raison'], $_POST['userid']);
    MessageManager::deleteAll($_POST['userid']);

    return $result;
}
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode(ban_user());