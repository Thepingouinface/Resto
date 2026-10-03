<?php include("entete.php"); ?>

<p class="lead">

<?php

$id = $_REQUEST['id'];

$requete = $base->prepare("SELECT
					restaurant.nom AS nom_du_restaurant,
					quartier.nom AS nom_quartier,
					restaurant.description AS description,
					restaurant.adresse FROM restaurant
					JOIN quartier ON quartier.id=id_quartier
					WHERE restaurant.id=:id
					");

$requete->bindValue(':id', $id);

$requete->execute();

$ligne = $requete->fetch();

echo '<h2>';
echo $ligne['nom_du_restaurant'];
echo '<small>';
echo ' (quartier ';
echo $ligne['nom_quartier'];
echo ')';
echo '</small>';
echo '</h2>';

echo '<address>';
echo $ligne['adresse'];
echo '</address>';

echo '<p>';
echo $ligne['description'];
echo '</p>';

echo '<iframe
			  width="400"
			  height="250"
			  frameborder="0" style="border:0"
			  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCfdfxefoZzEleeHJs5l0Mg065kn2ydoRk
			    &q='.$ligne['adresse'].'" allowfullscreen>
			</iframe>';

$requete = $base->prepare("SELECT cuisinier.nom AS nom_cuisinier,
			diplome.nom AS diplome,
			cuisinier.id AS id_cuisinier,
			restaurant.id FROM cuisinier
			JOIN diplome ON diplome.id=id_diplome
			JOIN restaurant ON restaurant.id=id_restaurant
			WHERE restaurant.id=:id
 ");
$requete->bindValue(':id', $id);

$requete->execute();

echo '<ul>';
while ($ligne = $requete->fetch()) {
	echo '<li><strong>Cuisinier : </strong><a href="fiche_cuisinier.php?id='.$ligne['id_cuisinier'].'"> '. $ligne['nom_cuisinier'] .'
	</a><strong>Diplome : </strong>'.$ligne['diplome'].'</li>';

};
echo '</ul>';

?>
<div>
	<h3>Réserver une table :</h3>
</div>
<div>
	<form action="reservation.php" method="get" class="form-group">
		<div>
			<label for="name">Nom :</label>
			<input type="text" name="name" id="name" class="form-control" />
		</div>
		<div>
			<label for="date">Date de la réservation :</label>
			<input type="date" name="date" id="date" class="form-control" />
		</div>
		<div>
			<label for="time">Heure de la réservation :</label>
			<input type="time" name="time" id="time" class="form-control" />
		</div>
		<div>
			<label for="nombre">Nombre de personnes :</label>
			<input type="number" name="nombre" id="nombre" class="form-control" />
		</div>
		<div>
			<input type="hidden" name="id_restaurant" value="<?= $id; ?>">
			<input type="submit" value="valider" class="btn btn-primary" >
		</div>
	</form>
</div>


<?php include("pieddepage.php"); ?>
