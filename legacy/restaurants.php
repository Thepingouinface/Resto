<?php include('entete.php'); ?>

<?php

$id_quartier = $_REQUEST['id_quartier'];

$requete = $base->prepare(
  "select nom,description from quartier where id=:id_quartier"
);

$requete->bindValue(":id_quartier", $id_quartier);

$requete->execute();

$ligne = $requete->fetch();

?>

<p class="lead">
 Voici les restaurants du quartier
 <?php
  echo $ligne['nom'];
 ?>
</p>


<p> <?=$ligne['description'];?></p>
<p>
 Cliquez sur le nom d'un restaurant
 pour voir sa description.
</p>

<ul>

<?php

$requete = $base->prepare(
  "select * from restaurant where id_quartier=:id_quartier"
);
$requete->bindValue(":id_quartier", $id_quartier);

$requete->execute();

while($ligne = $requete->fetch()) {
	echo '<li>';
	echo '<a href="fiche_restaurant.php?id=';
	echo $ligne['id'];
	echo '">';
	echo $ligne['nom'];

	$requete2 = $base->query(
		"SELECT COUNT(cuisinier.id) AS nombreCuisinier
		FROM cuisinier
		WHERE id_restaurant = ".$ligne['id']
		);

	$ligne2 = $requete2->fetch();
	?> (<?php
	echo $ligne2['nombreCuisinier'];
	?> cuisiniers)<?php
	echo '</li>';
}
?>

</ul>

<?php include('pieddepage.php'); ?>
