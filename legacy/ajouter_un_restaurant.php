<?php 

	include('entete.php'); ?>

	<p class="lead"></p><br /><br />

	<h2> Ajoutez un restaurant : <br /><br /></h2>

	<form action="creer_nouveau_restaurant.php">
		<div class="form-group row">
  			<label for="example-text-input" class="col-2 col-form-label">Nom du restaurant :</label>
  				<div class="col-10">
    				<input class="form-control" type="text" id="example-text-input" name="nom">
 				 </div>
 				 </div>
 		<div class="form-group row">
  			<label for="example-text-input" class="col-2 col-form-label">Adresse du restaurant :</label>
  				<div class="col-10">
    				<input class="form-control" type="text" id="example-text-input" name="adresse">
 				 </div>
 				 </div>
 		<div class="form-group row">
  			<label for="example-text-input" class="col-2 col-form-label">Description du restaurant :</label>
  				<div class="col-10">
    				<input class="form-control" type="text" id="example-text-input" name="description">
 				 </div>	
		
		<label>Quartier :</label>
			<select name="id_quartier">
			<?php 
	  			$sql = 'SELECT * FROM quartier';
				$request = $base->query($sql);
				while ($donnees = $request->fetch()) {
			?> 
					<option  value="<?php echo $donnees['id'] ?>">
						<?php
							print $donnees['nom'];
						?> 
					</option>

			<?php } ?>
			</select>
			<br />
		<a href="ajouter_un_quartier.php">Créer un nouveau quartier</a>
		<br />	 <br />
		<button type="button" class="btn btn-primary">Valider</button>

		
	</form>

	<?php include("pieddepage.php"); ?>

