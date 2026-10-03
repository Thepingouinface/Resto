<?php 
include("entete.php");
include('base.inc.php');

$id_quartier = $_REQUEST['id_quartier'];

$requete = $base->prepare(
  "select nom, description from quartier where id=:id_quartier"
);

$requete->bindValue(":id_quartier", $id_quartier);

$requete->execute();

$ligne = $requete->fetch();

?>

<form action="modifier_un_quartier.php">
	<fieldset id="Renseignez les champs suivants">
		<legend>Modifier un quartier : <?php echo $ligne['nom'];?></legend>

		<div>
			<label>Nom :
				<input name="nom" value="<?php echo $ligne['nom'] ?>">
			</label>
		</div>

		<div>
			<label>Description :
				<textarea name="description"><?php
					echo $ligne['description'];
				?></textarea>
			</label>
		</div>

		<input type="hidden" name="id" value="<?php echo $id_quartier ?>">

	</fieldset>

	<input type="submit">

</form>
