<?php
require_once dirname(__DIR__) . '/../models/Model.php';
require_once dirname(__DIR__) . '/../models/UserManager.php';

function login(){
    session_start();

    $result = new stdClass();
    $result->success = true;

    $login = $_POST['login'];
    $password = $_POST['password'];

    if(empty($login) || empty($password))
    {
        $result->success = false;
        $result->msg_err = "Vous devez remplir tout les champs.";
        return $result;
    }

    $user = UserManager::check($login, md5($password));

    if(empty($user))
    {
        $result->success = false;
        $result->msg_err = "L'association login/mot de passe est incorrect.";
        return $result;
    }

    if(!empty($user['ban']))
    {
        $result->success = false;
        $result->msg_err = "Vous avez été banni pour la raison suivante : " . $user['ban'];
        return $result;
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_role'] = $user['role'];
    return $result;
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode(login());