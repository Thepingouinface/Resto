<?php include("entete.php"); ?>

<div id="container">
  <h4>Vous voulez supprimer un quartier ?</h4>
  <form action="action_supprimer_un_quartier.php">
    <SELECT name="id_quartier" id="quartier">
      <?php 
        $sql='SELECT nom, id FROM quartier WHERE id not in (
                        select id_quartier
                          from restaurant
                            )';
        $request = $base->query($sql);
        while($data = $request->fetch()) {
      ?>
          <option value="<?php echo $data['id']; ?>">
            <?php echo $data ['nom']; ?>
          </option>
        <?php } ?>
    </SELECT>
    <input type="image" 
           name="suppression" 
           src="img/delete.svg" 
           style="width: 30px; height:30px;
                  display:inline-block;" 
           alt="Supprimer le quartier" 
           OnClick="return confirm('Voulez-vous vraiment supprimer ?');">
  </form>
</div>

<?php include("pieddepage.php"); ?>