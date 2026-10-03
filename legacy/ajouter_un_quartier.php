	<?php
		include('base.inc.php');
		include('config.inc.php');
		include('entete.php');
	?>
	<h3>Ajouter un nouveau quartier</h3>

	<form action="creer_nouveau_quartier.php" method="POST">
		<div>
			<label>Nom du quartier</label>
				<input name="nom" type="text" class="form-control" placeholder="Taper le nom du quartier">
		</div>
		<div>
			<label>Description</label>
				<textarea name="description" class="form-control" rows="3" placeholder="Taper la description du quartier"></textarea>
		</div>
			<button type="submit" class="btn btn-primary btn-lg btn-block">Valider</button>
	</form>	

	<?php
		include('pieddepage.php');
	?>


