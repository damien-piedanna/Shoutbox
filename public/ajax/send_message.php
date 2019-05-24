<?php
require_once dirname(__DIR__) . '/../models/Model.php';
require_once dirname(__DIR__) . '/../models/ShoutboxManager.php';
require_once dirname(__DIR__) . '/../models/MessageManager.php';
require_once dirname(__DIR__) . '/../models/UserManager.php';

function send_message()
{
    session_start();
    if(!isset($_SESSION['user_id']))
        exit();

    $result = new stdClass();
    $result->success = true;

    if(strtotime(date("Y-m-d H:i:s")) - strtotime($_SESSION['last_msg']) < 3) {
        $result->success = false;
        $result->msg_err = "Vous ne pouvez pas envoyer autant de message à la fois !";
        return $result;
    }

    $message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);
    if($message == '' || ctype_space($message)) {
        $result->success = false;
        $result->msg_err = "Votre message ne peut pas être vide.";
        return $result;
    }
    if(strlen($message) > 200) {
        $result->success = false;
        $result->msg_err = "Votre message contient trop de carractère.";
        return $result;
    }


    if(isset($_POST['idOldMessage'])) {
        if($_SESSION['user_role'] == 'member') {
            $result->success = false;
            $result->msg_err = "Vous n'avez pas les permissions pour modifier ce message.";
            return $result;
        }
        MessageManager::edit($_POST['idOldMessage'],$message);
    } else {
        $shoutboxid = UserManager::getShoutbox($_SESSION['user_id']);
        if ($_SESSION['user_role'] == 'admin' && substr($message, 0, 1) === '/') { //Commands
            $firstSpace = strpos($message, ' ');
            $command = substr($message, 1, $firstSpace-1);
            $parameters = substr($message, $firstSpace+1);

            if(empty($firstSpace) || ctype_space($parameters)) {
                $result->success = false;
                $result->msg_err = "Usage : /{commande} {paramètre}";;
                return $result;
            }
            switch ($command) {
                case 'title':
                    ShoutboxManager::editTitle($parameters, $shoutboxid);
                    break;
                case 'motd':
                    ShoutboxManager::editMotd($parameters, $shoutboxid);
                    break;
                default:
                    $result->success = false;
                    $result->msg_err = "La commande [/" . $command . "] n'éxiste pas.";;
                    return $result;
            }
        } else {
            MessageManager::add($shoutboxid, $_SESSION['user_id'],$message);
        }
    }

    $_SESSION['last_msg'] = date("Y-m-d H:i:s");
    return $result;
}
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode(send_message());