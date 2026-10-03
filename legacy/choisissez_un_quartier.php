<?php 
	include('entete.php');
?>
<h1>Modifier un quartier</h1>
<form action="modifier_un_quartier_form.php">
	<div class="quartier">
		<label>Choisissez un quartier
			<select name="id_quartier">
				<?php
				$requete = $base->query(
					'SELECT id, nom FROM quartier'
				);
				while($ligne = $requete->fetch()) { ?>
					<option value="<?php echo $ligne['id']; ?>">
						<?php echo $ligne['nom']; ?>
					</option>
				<?php }?>
			</select>
		</label>	
	</div>
	<input type="submit">
</form>
<?php include("pieddepage.php"); ?>
