<?php
 include('entete.php'); 
 ?>

<div class="suppr-resto"><h4>Supprimer un restaurant</h4>

	<!-- Sous titre -->
	<small>Veuillez sélectionner un restaurant à supprimer</small>
	
	<!-- Début formulaire de suppression -->
	<form action="action-suppr-restaurant.php" method="get">
		<select name="id_restaurant" id="restaurant">
			<?php $sql='SELECT id, nom FROM restaurant';
			$request = $base->query($sql);
			while($data = $request->fetch()) { ?>
			<option value="<?php echo $data['id']; ?>">
						<?php echo $data['nom']; ?>
			</option>
			<?php } ?>
		</select>
				<div id="bouton-suppr">
					<input type="submit" name="supprimer" value="Supprimer"/>
					
				<!-- End div bouton-suppr -->
				</div>
	
	<!-- End formulaire de suppression -->
	</form>
	
<!-- End div suppr-resto -->
</div>

<?php
 include('pieddepage.php');
 ?>
