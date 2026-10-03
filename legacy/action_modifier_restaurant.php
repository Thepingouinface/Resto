<?php include('entete.php'); ?>
<h1>Modifier un restaurant</h1>
<form action="form_restaurant.php" >
	
	<div class="restaurant">
		<label>Modifier le restaurant
			<select name="id_restaurant">
				<?php
				$requete = $base ->query(
					'SELECT id, nom FROM restaurant'
				);
				while($ligne = $requete->fetch()) { ?>
					<option value="<?php echo $ligne['id']; ?>">
						<?php echo $ligne['nom']; ?>
					</option>
				<?php }?>
			</select>
		</label>
	</div>

	<input type="submit" name="envoyer">
</form>
<?php include("pieddepage.php"); ?>
