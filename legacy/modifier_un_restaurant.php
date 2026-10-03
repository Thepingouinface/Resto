<?php include("entete.php"); ?>
<h3>Modifier un restaurant</h3>

<?php
$nom= $_REQUEST['nom'];
$adresse= $_REQUEST['adresse'];
$description=$_REQUEST['description'];
$requete = $base->prepare('
	UPDATE restaurant
		SET
			nom = :nom,
      adresse = :adresse,
			description = :description
		WHERE id = :id
	');
$requete->bindValue(":nom", $_REQUEST['nom']);
$requete->bindValue(":adresse", $_REQUEST['adresse']);
$requete->bindValue(":description", $_REQUEST['description']);
$requete->bindValue(":id", $_REQUEST['id']);
$ok = $requete->execute();
if ($ok) {
	echo '<p>Le restaurant a été mis à jour.</p>';
} else {
	echo '<p>Le restaurant n\'a PAS été mis à jour !</p>';
}

?>
<ul>
<li>Nom du restaurant : <?php echo $nom; ?></li>
<li>Adresse du restaurant : <?php echo $adresse; ?></li>
<li>Description du restaurant : <?php echo $description;?></li>
</ul>
<?php include("pieddepage.php"); ?>
