DELIMITER $$

CREATE PROCEDURE EnsureSchemaExists()
BEGIN
    DECLARE count INT;
    SELECT COUNT(*)
    INTO count
    FROM information_schema.schemata
    WHERE schema_name = 'keycloak_schema';

    IF count = 0 THEN
        CREATE SCHEMA keycloak_schema;
    END IF;
END$$

CALL EnsureSchemaExists();
DROP PROCEDURE EnsureSchemaExists;

DELIMITER ;
