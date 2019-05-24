<?php

/**
 * Class MessageManager
 * Gère les messages
 */
class MessageManager extends Model
{
    /**
     * @return array[Message]
     */
    public static function getMessages($shoutboxid)
    {
        $messages = [];
        $req = self::getBdd()->prepare('SELECT * FROM message JOIN user ON user.id = message.userid WHERE message.shoutboxid = :shoutboxid ORDER BY created_at ASC');
        $req->execute(['shoutboxid' => $shoutboxid]);
        while($data = $req->fetch(PDO::FETCH_ASSOC))
        {
            if(boolval($data['appear'])) {
                array_push($messages, [
                    'id' => $data['msgid'],
                    'content' => $data['content'],
                    'author' => $data['username'],
                    'author_role' => $data['role'],
                    'author_avatar' => $data['avatar'],
                    'appear' =>  $data['appear'],
                    'created_at' => $data['created_at'],
                    'author_id' => $data['id'],
                ]);
            } else {
                array_push($messages, [
                    'id' => $data['msgid'],
                    'appear' =>  $data['appear'],
                ]);
            }

        }
        $req->closeCursor;
        return $messages;
    }

    public static function add($shoutboxid, $userid, $content)
    {
        $req = parent::getBdd()->prepare('INSERT INTO message (shoutboxid, userid, content) VALUES (:shoutboxid, :userid, :content)');
        $req->execute([
            'shoutboxid' => $shoutboxid,
            'userid' => $userid,
            'content' => $content
        ]);
    }

    public static function edit($id, $content)
    {
        $req = parent::getBdd()->prepare('UPDATE message SET content = :content WHERE msgid = :id');
        $req->execute([
            'id' => $id,
            'content' => $content
        ]);
    }

    public static function delete($id)
    {
        $req = parent::getBdd()->prepare('UPDATE message SET appear = 0 WHERE msgid = :id');
        $req->execute(['id' => $id]);
    }

    public static function deleteAll($id)
    {
        $req = parent::getBdd()->prepare('UPDATE message SET appear = 0 WHERE userid = :id');
        $req->execute(['id' => $id]);
    }
}