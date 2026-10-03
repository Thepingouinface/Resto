<?php include('entete.php'); ?>

<?php

$id = $_REQUEST['id'];

$requete = $base->prepare("DELETE FROM cuisinier WHERE id=:id");
$requete->bindValue(":id", $id);
$ok = $requete->execute();

if($ok) {
  echo "Le cuisinier à bien été supprimer";
} else {
  echo "erreur dans la suppression.";
}

?>
