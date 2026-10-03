<?php include("entete.php"); ?>

<?php

$id = $_REQUEST['id_restaurant'];

$requete = $base->prepare("SELECT nom FROM restaurant WHERE id=:id");
$requete->bindValue(':id', $id);

$requete->execute();

$ligne = $requete->fetch();

setlocale(LC_ALL, 'fr_fr');

  $resto = $ligne['nom'];
  $date = $_REQUEST['date'];
  $time = $_REQUEST['time'];
  $nombre = $_REQUEST['nombre'];
  $name = $_REQUEST['name'];
  $to = 'chrisparis.eh@gmail.com';
  $subject = 'reservation en ligne';
  $message =  "Votre réservation du : <strong>". $date . "</strong> à <strong>" . $time . "</strong> pour <strong>" . $nombre . "</strong> personnes au nom de <strong>". $name . "</strong> à bien été prise en compte. A bientôt dans notre restaurant <strong>". $resto ."</strong>.";
/*
  // A ne pas mettre lorsque l'on est sur un vrai serveur.
  ini_set('SMTP','smtp.gmail.com');
  ini_set('smtp_port','587');
  ini_set('sendmail_from','chrisparis.eh@gmail.com');
  // Fin du serveur mail local

  $ok = mail($to, $subject, $message);

  if ($ok) {
    echo "<p>Le mail à bien été envoyé.</p>";
  } else {
    echo "<p>Le mail n'a pas pu être envoyé.</p>";
  }
*/

$request = $base->prepare("INSERT INTO reservation (nom, date, heure, nombre, id_restaurant) VALUES (:nom, :date, :heure, :nombre, :id_restaurant)");
$request->bindValue(':nom', $name);
$request->bindValue(':date', $date);
$request->bindValue(':heure', $time);
$request->bindValue(':nombre', $nombre);
$request->bindValue(':id_restaurant', $id);

$request->execute();

?>

<p><?= $message; ?></p>


<?php include("pieddepage.php"); ?>
