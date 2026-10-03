<?php
		include('base.inc.php');
		include('config.inc.php');
		include('entete.php');
?>
	<h3>Votre quartier a bien été ajouté !</h3> 
	
	<ul>
	<?php
		$nom = $_REQUEST['nom'];
		$description = $_REQUEST['description'];

			$sql = 'INSERT INTO quartier (nom, description)
			VALUES (:nom, :description)';
			$request = $base->prepare($sql); // la requête n'est pas éxcécutée mais elle est préparée, il attend des valeurs
			$request->bindValue(':nom', $nom);  // bindValue cela met des valeurs. PLUS D'INFOS DANS php.net/pdo
			$request->bindValue(':description', $description);
			$request->execute();
		?>
			<li>Nom du quartier créé : <?php echo $nom; ?></li>
			<li>Description du quartier créé : <?php echo $description; ?></li>
	</ul>
