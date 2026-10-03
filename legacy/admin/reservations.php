<?php include('entete.inc.php'); ?>

<form action="reservations.php" method="get">
  <div class="form-group">
    <label for="resto">Resto : </label>
    <select name="resto" id="resto" class="form-control">
      <?php
          $sql = 'SELECT * FROM restaurant';
        $request = $base->query($sql);
        while ($donnees = $request->fetch()) {
      ?>
          <option  value="<?php echo $donnees['id'] ?>">
            <?php
              echo $donnees['nom'];
            ?>
          </option>
      <?php } ?>
    </select>
  <button type="submit" class="btn btn-primary">Voir les réservations</button>
  </div>
</form>


<?php
$id = $_REQUEST['resto'];
//var_dump($id);

$requete = $base->prepare('SELECT * FROM reservation WHERE id_restaurant=:id');
$requete->bindValue(':id', $id);
$requete->execute();
//$ligne = $requete->fetchAll();


?>

<table class="table">
   <thead>
     <tr>
       <th>Date</th>
       <th>Heure</th>
       <th>Nom</th>
       <th>Nombre</th>
     </tr>
   </thead>
   <tbody>
  <?php
  while ($ligne = $requete->fetch()) {
  ?>
     <tr>
       <td><?= $ligne['date']; ?></td>
       <td><?= $ligne['heure']; ?></td>
       <td><?= $ligne['nom']; ?></td>
       <td><?= $ligne['nombre']; ?></td>
     </tr>
<?php } ?>
  </tbody>
</table>


