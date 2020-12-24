-- ----------------------------------------------------------------------------
-- DROP-GALAXY-TABLES.SQL
-- ----------------------------------------------------------------------------
-- This script drops the database tables.
-- Tested on Postgresql 11.
--
-- Usage:
--     psql -l postgres -c \
--             "psql -d galaxy -e -f /tmp/drop-galaxy-tables.sql"
--
--     psql -U galaxy -h postgres -d galaxy -e -f drop-galaxy-tables.sql
--
-- ----------------------------------------------------------------------------

BEGIN;

DROP TABLE identity_room;
DROP TABLE room;
DROP TABLE domain;
DROP TABLE identity;
DROP TABLE account;
DROP TABLE param;

COMMIT;
