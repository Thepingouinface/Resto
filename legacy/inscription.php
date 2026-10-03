<?php
	include('entete.php');


	if (isset($_POST['bouton'])) {
		if (!empty($_POST['nom']) AND (!empty($_POST['mdp']))) {
			echo 'ok';
		}
		else {
			echo "non";
		}
	}
?>

		<h3>INSCRIPTION</h3>
<form method="POST" action="action_inscription">
	<div class="form-group">
		<label>Nom</label><br>
		<input type="text" name="nom"><br><br>
	</div>

	<div class="form-group">
		<label>Mot de passe</label><br>
		<input type="password" name="mdp">
	</div>

 <input type="submit" name="bouton" value="S'inscrire">
</form>

</body>
</html>
