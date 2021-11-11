-- ----------------------------------------------------------------------------
-- 01-CREATE-GALAXY-DATABASE.SQL
-- ----------------------------------------------------------------------------
-- This script creates the database and the database user.
-- Tested on Postgresql 13.
--
-- Usage:
--     su -l postgres -c "psql -e -f /tmp/01-create-galaxy-database.sql"
--
-- ----------------------------------------------------------------------------


-- ----------------------------------------------------------------------------
-- USERS
-- ----------------------------------------------------------------------------
CREATE ROLE galaxy WITH LOGIN;
ALTER ROLE galaxy WITH PASSWORD 'galaxy';

-- ----------------------------------------------------------------------------
-- DATABASE
-- ----------------------------------------------------------------------------
CREATE DATABASE galaxy WITH
    TEMPLATE template0
    OWNER galaxy
    ENCODING 'UTF-8'
    LC_COLLATE 'en_US.UTF-8'
    LC_CTYPE 'en_US.UTF-8';
