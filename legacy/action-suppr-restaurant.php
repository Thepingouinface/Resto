<?php
 include('entete.php'); 
 ?>
 
<?php

	$id_restaurant = $_REQUEST['id_restaurant'];
	
	//suppression d'un cuisinier
    $requete = $base->prepare(
    "DELETE FROM cuisinier WHERE id_restaurant=:id_restaurant"
    );

    $requete->bindValue(":id_restaurant", $id_restaurant);

    $requete->execute();
	
	if ($requete){
		echo '<p>La suppression du ou des cuisiniers associés au restaurant à bien été effectuée !!</p>';
	}else{
		echo '<p>Il y a eu un problème lors de la suppression du ou des cuisiniers associés au restaurant !</p>';
	}

	// vide la requete 
	$requete->closeCursor();


	
	// Suppression d'un restaurant
    $requete = $base->prepare(
    "DELETE FROM restaurant WHERE id=:id_restaurant"
    );

    $requete->bindValue(":id_restaurant", $id_restaurant);

    $requete->execute();
	
	if ($requete){
		echo '<p>La suppression du restaurant à bien été effectuée !!</p>';
	}else{
		echo '<p>Il y a eu un problème lors de la suppression du restaurant !</p>';
	}

	// vide la requete 
	$requete->closeCursor();




 include('pieddepage.php');
 ?>
