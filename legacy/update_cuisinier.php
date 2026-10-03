<?php
include('entete.php');

// on récupère et on stocke dans une variable l'id du cuisinier à modifier
// l'id a été passé dans l'URL : "update_cuisinier.php?id=42" par exemple
$id = $_REQUEST['id']; ?>

<!-- formulaire -->
<div width="100%">
<form action="action_update_cuisinier.php"
      class="form-horizontal">
  <!-- on transmet au fichier PHP de destination l'id du cuisinier -->
  <input type="hidden" name="id" value="<?php echo $id ?>">

  <h3>Modifier les informations d'un cuisinier :</h3>
  <?php
      //afficher le cuisinier à modifier
      $sql = 'SELECT * FROM cuisinier WHERE id =:id';
      $request = $base->prepare($sql);
      $request->bindValue(":id", $id);
      $request->execute();
      $ligneCuisinier = $request->fetch();
      ?>
      <div class="form-group">
        <label class="control-label" for="nom">Nom :</label>
          <input name="nom"
                 value="<?php echo($ligneCuisinier['nom']); ?>"
                 class="form-control"
                 id="nom"/>
      </div>

      <div class="form-group">
        <label class="control-label" for="salaire">Salaire :</label>
           <input type="number" name="salaire"
                  value="<?php echo($ligneCuisinier['salaire']); ?>"
                  class="form-control"
                  id="salaire"/>
      </div>

      <div class="form-group">
      <label class="control-label" for="id_restaurant">Restaurant :</label>
       <select name="id_restaurant" class="form-control" id="id_restaurant">
        <?php
        //afficher la liste des restaurants
        $sql = 'SELECT id, nom FROM restaurant';
        $request = $base->prepare($sql);
        $request->execute();
        while($ligneRestaurant = $request->fetch()){ ?>
            <option value="<?php echo $ligneRestaurant['id']; ?>"
            <?php
            if ($ligneRestaurant['id'] == $ligneCuisinier['id_restaurant']) {
               echo 'selected';
            }
            ?>
            >
             <?= $ligneRestaurant['nom']; ?>
           </option>
        <?php } ?>
       </select>
    </div>

    <div class="form-group">
     <label class="control-label" for="id_diplome">Diplôme :</label>
      <select name="id_diplome" class="form-control" id="id_diplome">
        <?php
        //afficher la liste des diplômes
        $sql = 'SELECT id, nom FROM diplome';
        $request = $base->prepare($sql);
        $request->execute();
        while($ligneDiplome = $request->fetch()){ ?>
          <option value="<?php echo $ligneDiplome['id']; ?>"
          <?php
            if ($ligneDiplome['id'] == $ligneCuisinier['id_diplome']) {
               echo 'selected';
            }
          ?>
          >
            <?php echo $ligneDiplome['nom']; ?>
          </option>
        <?php } ?>
      </select>
    </div>
    <div class="form-group">
      <input type="submit" name="valider" class="btn btn-primary" />
    </div>

</form>
</div>

<?php include('pieddepage.php'); ?>
