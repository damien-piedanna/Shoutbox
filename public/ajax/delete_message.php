<?php
require_once dirname(__DIR__) . '/../models/Model.php';
require_once dirname(__DIR__) . '/../models/ShoutboxManager.php';
require_once dirname(__DIR__) . '/../models/MessageManager.php';
require_once dirname(__DIR__) . '/../models/UserManager.php';

function delete_message()
{
    session_start();
    if(!isset($_SESSION['user_id']))
        exit();

    $result = new stdClass();
    $result->success = true;

    if(!isset($_POST['idOldMessage'])) {
        $result->success = false;
        $result->msg_err = "ID non renseigné !";
        return $result;
    }
    if($_SESSION['user_role'] == 'member') {
        $result->success = false;
        $result->msg_err = "Vous n'avez pas les permissions pour supprimer ce message.";
        return $result;
    }

    MessageManager::delete($_POST['idOldMessage']);
    return $result;
}
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode(delete_message());