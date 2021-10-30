-- ----------------------------------------------------------------------------
-- 99-DROP-GALAXY-TABLES.SQL
-- ----------------------------------------------------------------------------
-- This script drops the database tables.
-- Tested on Postgresql 11.
--
-- Usage:
--     psql -l postgres -c \
--             "psql -d galaxy -e -f /tmp/99-drop-galaxy-tables.sql"
--
--     psql -U galaxy -h postgres -d galaxy -e -f 99-drop-galaxy-tables.sql
--
-- ----------------------------------------------------------------------------

BEGIN;

DROP TABLE IF EXISTS profile_room;
DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS domain;
DROP TABLE IF EXISTS profile;
DROP TABLE IF EXISTS identity;
DROP TABLE IF EXISTS param;

DROP TYPE IF EXISTS room_accessibility;
DROP TYPE IF EXISTS room_visibility;
DROP TYPE IF EXISTS room_name_type;
DROP TYPE IF EXISTS domain_auth_type;

COMMIT;
