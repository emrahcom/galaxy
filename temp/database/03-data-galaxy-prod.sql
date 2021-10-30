-- ----------------------------------------------------------------------------
-- 03-DATA-GALAXY-PROD.SQL
-- ----------------------------------------------------------------------------
-- This script creates the production data on the database. Tested on
-- Postgresql 11.
--
-- Usage:
--     psql -l postgres -c \
--             "psql -d galaxy -e -f /tmp/03-data-galaxy-prod.sql"
--
--     psql -U galaxy -h postgres -d galaxy -e -f 03-data-galaxy-prod.sql
--
-- ----------------------------------------------------------------------------

BEGIN;

INSERT INTO param VALUES (DEFAULT, 'system-prod', '1');

COMMIT;
