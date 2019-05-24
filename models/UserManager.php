<?php

/**
 * Class UserManager
 */
class UserManager extends Model
{
    /**
     * Check if user does exist
     * @param $login string
     * @param $password string
     * @return null|User
     */
    public static function check($login, $password)
    {
        $req = parent::getBdd()->prepare('SELECT * FROM user WHERE username = :login AND password = :password');
        $req->execute([
            'login' => $login,
            'password' => $password,
        ]);
        return $req->fetch(PDO::FETCH_ASSOC);
    }

    public static function get($id)
    {
        $req = parent::getBdd()->prepare('SELECT * FROM user WHERE id = :id');
        $req->execute(['id' => $id]);
        return $req->fetch(PDO::FETCH_ASSOC);
    }

    public static function getShoutbox($id)
    {
        $req = parent::getBdd()->prepare('SELECT shoutboxid FROM user WHERE id = :id');
        $req->execute(['id' => $id]);
        return $req->fetch(PDO::FETCH_ASSOC)['shoutboxid'];
    }

    public static function setShoutbox($shoutboxid, $id)
    {
        $req = parent::getBdd()->prepare('UPDATE user SET shoutboxid = :shoutboxid WHERE id = :id');
        $req->execute([
            'shoutboxid' => $shoutboxid,
            'id' => $id,
        ]);
    }

    public static function ban($raison, $id)
    {
        $req = parent::getBdd()->prepare('UPDATE user SET ban = :raison WHERE id = :id');
        $req->execute([
            'raison' => $raison,
            'id' => $id
        ]);
    }
}