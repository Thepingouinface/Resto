<?php include("entete.php");

$id = $_REQUEST['id'];

$requete = $base->prepare("
    SELECT
      cuisinier.nom AS nom_cuisinier,
      cuisinier.salaire AS salaire,
      diplome.nom AS diplome,
      cuisinier.id AS id_cuisinier,
      restaurant.nom AS restaurant
    FROM cuisinier
      JOIN diplome ON diplome.id=id_diplome
      JOIN restaurant ON restaurant.id=id_restaurant
    WHERE cuisinier.id=:id
 ");

$requete->bindParam(':id', $id);
$requete->execute();
$ligne = $requete->fetch();

echo '<h2>'.$ligne['nom_cuisinier'].'</h2>';
echo '<p> titulaire du '.$ligne['diplome'].',</p>';
echo '<p> travaille dans le restaurant : '.$ligne['restaurant'].',</p>';
echo '<p> pour un salaire de '.$ligne['salaire'].'€.</p>';
//Lien modifier cuisinier
echo '<a href="update_cuisinier.php?id='.$ligne['id_cuisinier'].'">Modifier </a><br />';
//Lien supprimer cuisinier
echo '<a href="action_supprimer_cuisinier.php?id='.$ligne['id_cuisinier'].'">Supprimer</a>';
?>
