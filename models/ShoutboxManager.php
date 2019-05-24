<?php

/**
 * Class ShoutboxManager
 * Gère les shoutboxs
 */
class ShoutboxManager extends Model
{
    /**
     * @return array[Params]
     */
    public static function getAll()
    {
        $shoutboxs = [];
        $req = self::getBdd()->prepare('SELECT * FROM shoutbox');
        $req->execute();
        while($data = $req->fetch(PDO::FETCH_ASSOC))
        {
            array_push($shoutboxs, [
                'id' => $data['id'],
                'title' => $data['title'],
                'motd' => $data['motd'],
            ]);
        }
        $req->closeCursor;
        return $shoutboxs;
    }

    public static function editTitle($content, $id)
    {
        $req = self::getBdd()->prepare('UPDATE shoutbox SET title = :content WHERE id = :id');
        $req->execute([
            'content' => $content,
            'id' => $id
        ]);
    }

    public static function editMotd($content, $id)
    {
        $req = self::getBdd()->prepare('UPDATE shoutbox SET motd = :content WHERE id = :id');
        $req->execute([
            'content' => $content,
            'id' => $id
        ]);
    }

}