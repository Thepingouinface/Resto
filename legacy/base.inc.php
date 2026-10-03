<?php

include("config.inc.php");

$base = new PDO(
  "mysql:host=localhost;dbname=$nombase;charset=utf8",
  $utilisateur,
  $motdepasse
);

$base->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

?>
