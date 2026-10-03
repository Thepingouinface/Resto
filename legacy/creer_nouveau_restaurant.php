<?php
	include('base.inc.php');
	include('entete.php');

// RECUPERATION DES INFOS
	$nom=$_REQUEST['nom'];
	$description=$_REQUEST['description'];
	$adresse = $_REQUEST['adresse'];
	$id_quartier = $_REQUEST['id_quartier'];


// ENTREE DES INFORMATIONS
	$sql = 'INSERT INTO restaurant (nom, description, adresse, id_quartier) 
	VALUES (:nom, :adresse, :description, :id_quartier)';
	$request = $base->prepare($sql);
	$request->bindValue(':nom', $nom);
	$request->bindValue(':adresse', $adresse);
	$request->bindValue(':description', $description);
	$request->bindValue(':id_quartier', $id_quartier);
	$request->execute();
	echo "Votre nouveau restaurant a bien été crée :" . "<br />" . "Il s'appelle :<strong> " . $nom . "</strong>, à l'adresse :<strong> " . $adresse . "</strong><br />" ."Voici ce qu'on en dit :<strong> " . $description."</strong>";
?>

<?php include('pieddepage.php'); ?>