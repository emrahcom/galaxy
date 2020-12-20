-- ----------------------------------------------------------------------------
-- CREATE-GALAXY-TABLES.SQL
-- ----------------------------------------------------------------------------
-- This script creates the database tables.
-- Tested on Postgresql 11.
--
-- Usage:
--     psql -l postgres -c \
--             "psql -d galaxy -e -f /tmp/create-galaxy-tables.sql"
--
-- ----------------------------------------------------------------------------

BEGIN;

-- ----------------------------------------------------------------------------
-- PARAM
-- ----------------------------------------------------------------------------
-- The (key, value) pairs.
--
-- id                   : the record id
-- key                  : the param name (unique)
-- value                : the param value
-- ----------------------------------------------------------------------------
CREATE TABLE param (
    "id" serial NOT NULL PRIMARY KEY,
    "key" varchar(50) NOT NULL,
    "value" varchar(250) NOT NULL
);
CREATE UNIQUE INDEX ON param("key");
ALTER TABLE param OWNER TO galaxy;
INSERT INTO param VALUES (DEFAULT, 'admin-passwd',
    crypt('admin', gen_salt('bf', 8)));
-- ----------------------------------------------------------------------------
-- ACCOUNT
-- ----------------------------------------------------------------------------
-- The account base data.
--
-- id                   : the record id
-- email                : the email address (unique)
-- passwd               : the password hash
-- name                 : the account name (unique)
-- avatar               : the relative path of the avatar
-- active               : is active
-- created_at           : the account creation time
-- ----------------------------------------------------------------------------
CREATE TABLE account (
    "id" serial NOT NULL PRIMARY KEY,
    "email" varchar(250) NOT NULL,
    "passwd" varchar(250) NOT NULL,
    "name" varchar(250) NOT NULL,
    "avatar" varchar(250) NOT NULL DEFAULT '',
    "active" boolean NOT NULL DEFAULT TRUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ON account("email");
CREATE UNIQUE INDEX ON account("name");
CREATE INDEX ON account("active");
CREATE INDEX ON account("created_at");
ALTER TABLE account OWNER TO galaxy;
-- ----------------------------------------------------------------------------

COMMIT;
