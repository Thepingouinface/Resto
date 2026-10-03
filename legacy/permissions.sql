-- Pour créer un utilisateur
DROP user IF EXISTS 'siteweb'@'localhost';
CREATE user 'siteweb'@'localhost' IDENTIFIED BY '1234';

  -- Pour permettre les permissions
  GRANT SELECT, UPDATE, INSERT, DELETE
    ON restov2.quartier
    TO 'siteweb'@'localhost';
  GRANT SELECT, UPDATE, INSERT, DELETE
    ON restov2.restaurant
    TO 'siteweb'@'localhost';
  GRANT SELECT, UPDATE, INSERT, DELETE
    ON restov2.cuisinier
    TO 'siteweb'@'localhost';
  GRANT SELECT, INSERT
    ON restov2.diplome
    TO 'siteweb'@'localhost';
