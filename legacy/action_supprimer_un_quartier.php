<?php include('entete.php'); ?>


<?php
//le formulaire nous a envoyé une variable qui s'appelle id_quartier, on en récupère la valeur dans la variable php $id_quartier
	$id_quartier = $_REQUEST['id_quartier'];

// on prépare une requete pour récupérer le nom du quartier correspondant au numero que l'on a récupéré dans $id_quartier
	$requete = $base->prepare(
		'select nom FROM quartier where id=:id_quartier');
//dans cette requete, on remplace id_quartier par le bon numero
	$requete->bindValue(":id_quartier",$id_quartier);
// on execute la requete et on recupere dans la variable $ok vrai si tout s'est bien passé et faux s'il y a une erreur
	$ok = $requete->execute();
  	if ($ok) {
  		// si la requete s'est bien executee, on recupere la premiere ligne du resultat
  		$ligne = $requete->fetch();
  		// on lit ce qu'il y a dans la colonne nom et on la stocke dans $nom_quartier
			$nom_quartier = $ligne['nom'];
			// on prepare la requete qui va effacer le quartier
			$requete = $base->prepare(
	    "Delete from quartier where id=:id_quartier"
	    );
			// comme pour la premiere requete
	    $requete->bindValue(":id_quartier", $id_quartier);

	  	$ok = $requete->execute();
	  	if ($ok) {
	  		echo 'nous avons bien supprimé le quartier : ' . $nom_quartier;
	  	} else {
	  		echo 'nous avons rencontré un problème lors de la suppression';
	  	}
		} else {
			echo 'nous avons rencontré un problème lorsque nous avons récupérer le nom du quartier';
		}
  	

?>

	