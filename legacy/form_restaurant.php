<?php
include("entete.php");

$id = $_REQUEST['id_restaurant'];

$requete = $base->prepare("
  select nom, adresse, description
   from restaurant
    where id=:id_restaurant
");

$requete->bindValue(":id_restaurant", $id);

$requete->execute();

$ligne = $requete->fetch();
?>

<form action="modifier_un_restaurant.php" >

<fieldset>
	<legend>Modifier un restaurant :
		<?php echo $ligne['nom'];?>
	</legend>

	<div>
		<label for="nom">Nom :</label>
			<input id="nom" class="form-control"
				name="nom"
				value="<?php echo $ligne['nom']; ?>"
			>
	</div>

	<div>
		<label for="adresse">Adresse :</label>
			<input id="adresse" class="form-control"
				name="adresse"
				value="<?php echo $ligne['adresse']; ?>"
			>
	</div>

	<div>
		<label for="description">Description :</label>
	 		<textarea id="description" class="form-control"
				name="description"><?php
				echo $ligne['description'];
			?></textarea>
	</div>

	<input type="hidden" name="id"
		value="<?php echo $id ?>">

</fieldset>

<button type="submit" class="btn btn-primary btn-lg btn-block">
	Envoyer
</button>
