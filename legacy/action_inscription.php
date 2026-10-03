<?php
	include('entete.php');



	$nom=$_POST['nom'];
	$mdp=$_POST['mdp'];
			
				$sql='INSERT INTO utilisateur (nom,mdp) VALUES (:nom,:mdp)';
				$request = $base->prepare($sql);
				$request -> bindvalue(':nom',$nom);
				$request -> bindvalue(':mdp',$mdp);
				$request -> execute();


?>


<p>Bonjour <?=$nom?>, vous êtes bien inscrit.<a href="connection.php">Continuer</a></p>