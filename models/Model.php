<?php

/**
 * Class Model
 * Abstract class for models
 */
abstract class Model
{
    /**
     * @var
     */
    protected static $_bdd;

    /**
     * Instanciates connection to database
     */
    private static function setBdd()
    {
        self::$_bdd = new PDO('mysql:host=MY_HOST;dbname=MY_DBNAME;charset=utf8','MY_USER','MY_PASSWORD');
        self::$_bdd->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
    }

    /**
     * Return connection to database
     * @return mixed
     */
    protected static function getBdd()
    {
        if(is_null(self::$_bdd))
            self::setBdd();
        return self::$_bdd;
    }

    /**
     * @param $table
     * @param $attribute
     * @param $newValue
     * @param $id
     */
    public static function change($table, $attribute, $newValue, $id)
    {
        $req = self::getBdd()->prepare('UPDATE ' . $table . ' SET ' . $attribute . ' = :newAttribute WHERE ID = :id');
        $req->execute([
            'newAttribute' => $newValue,
            'id'           => $id,
        ]);
    }
}