-- ----------------------------------------------------------------------------
-- 04-DATA-GALAXY-DEFAULT.SQL
-- ----------------------------------------------------------------------------
-- This script creates the default data on the database. Needed for both the
-- production and testing. Tested on Postgresql 11.
--
-- Usage:
--     psql -l postgres -c \
--             "psql -d galaxy -e -f /tmp/04-data-galaxy-default.sql"
--
--     psql -U galaxy -h postgres -d galaxy -e -f 04-data-galaxy-default.sql
--
-- ----------------------------------------------------------------------------

BEGIN;

COMMIT;
