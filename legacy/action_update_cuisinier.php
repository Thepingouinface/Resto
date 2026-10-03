<?php include ("entete.php") ?>

<?php
$id = $_REQUEST['id'];
$nom = $_REQUEST['nom'];
$salaire = $_REQUEST['salaire'];
$id_restaurant = $_REQUEST['id_restaurant'];
$id_diplome = $_REQUEST['id_diplome'];

//on effectue les modifications dans la bdd
$request = $base->prepare(
        'UPDATE cuisinier
          SET nom = :nom,
              salaire = :salaire,
              id_restaurant = :id_restaurant,
              id_diplome = :id_diplome
          WHERE id = :id');

$request->bindValue(':nom', $nom);
$request->bindValue(':salaire', $salaire);
$request->bindValue(':id_restaurant', $id_restaurant);
$request->bindValue(':id_diplome', $id_diplome);
$request->bindValue(':id', $id);
$ok = $request->execute();
// execute retourne dans $ok VRAI si ça a marché, FAUX sinon
if ($ok) {
  echo "<p>La fiche du cuisinier a bien été mise à jour.</p>";
echo '<a href="fiche_cuisinier.php?id='.$id.'">Retourner sur la fiche du cuisinier</a>';
} else {
  echo "<p>La fiche du cuisinier n'a pas été mise à jour.</p>";
}
?>

<?php include ("pieddepage.php") ?>
