<?php include("entete.php"); ?>

<p class="lead">Voici les quartiers</p>

<p>
 Cliquez sur le nom d'un quartier
 pour voir la liste des restaurants du quartier.
</p>

<ul>

<?php







$requete = $base->query("SELECT quartier.nom as nom_quartier, quartier.id, COUNT(restaurant.id) as nbrResto from restaurant RIGHT JOIN quartier on id_quartier = quartier.id GROUP BY quartier.nom, quartier.id");

while($ligne = $requete->fetch()) {

  echo '<li>';
  echo '<a href="restaurants.php?id_quartier=';
  echo $ligne['id'];
  echo '">';
  echo $ligne['nom_quartier'];
  echo  ' ('.$ligne['nbrResto'];
  echo " restaurant";
 if ($ligne['nbrResto']>1) {
	echo 's';
 }
  echo ')';
  echo '</a>';
  echo '</li>';

}


?>

</ul>

<?php include("pieddepage.php"); ?>
