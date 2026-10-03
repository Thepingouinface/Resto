<?php 
	include("entete.php");
?>
<h3>Modifier un quartier</h3>

<?php

$nom= $_REQUEST['nom'];
$description=$_REQUEST['description'];
$requete = $base->prepare('
	UPDATE quartier 
	    SET nom = :nom, 
		description= :description
	  WHERE id = :id
	');
$requete-> bindValue(":nom", $_REQUEST['nom']);
$requete-> bindValue(":description", $_REQUEST['description']);
$requete-> bindValue(":id", $_REQUEST['id']);
$ok = $requete->execute();
if ($ok) {
	echo "<p>Le quartier a bien été modifié</p>";
} else {
	echo "<p>Erreur : ça a pas marché</p>";
}
?>
<ul>
	<li>Nom du quartier : <?php echo $nom; ?></li>
	<li>Description du quartier : <?php echo $description; ?></li>
</ul>

<?php include("pieddepage.php"); ?>
