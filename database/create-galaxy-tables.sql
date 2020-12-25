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
--     psql -U galaxy -h postgres -d galaxy -e -f create-galaxy-tables.sql
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
-- id                   : the record id
-- email                : the email address (unique)
-- passwd               : the password hash
-- active               : is active
-- created_at           : the account creation time
-- updated_at           : the account update time
-- ----------------------------------------------------------------------------
CREATE TABLE account (
    "id" serial NOT NULL PRIMARY KEY,
    "email" varchar(250) NOT NULL,
    "passwd" varchar(250) NOT NULL,
    "active" boolean NOT NULL DEFAULT TRUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ON account("email");
CREATE INDEX ON account("active");
CREATE INDEX ON account("created_at");
CREATE INDEX ON account("updated_at");
ALTER TABLE account OWNER TO galaxy;
-- ----------------------------------------------------------------------------
-- IDENTITY
-- ----------------------------------------------------------------------------
-- avatar               : the relative path of the avatar or gravatar
-- ----------------------------------------------------------------------------
CREATE TABLE identity (
    "id" serial NOT NULL PRIMARY KEY,
    "account_id" integer NOT NULL REFERENCES account(id)
        ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "email" varchar(250) NOT NULL,
    "avatar" varchar(250) NOT NULL DEFAULT '',
    "active" boolean NOT NULL DEFAULT TRUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW()
);
CREATE INDEX ON identity("name");
CREATE INDEX ON identity("email");
CREATE INDEX ON identity("active");
CREATE INDEX ON identity("created_at");
CREATE INDEX ON identity("updated_at");
ALTER TABLE identity OWNER TO galaxy;
-- ----------------------------------------------------------------------------
-- DOMAIN
-- ----------------------------------------------------------------------------
-- Each domain should have an owner.
-- ----------------------------------------------------------------------------
CREATE TABLE domain (
    "id" serial NOT NULL PRIMARY KEY,
    "account_id" integer NOT NULL REFERENCES account(id)
        ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "token_aud" varchar(250) NOT NULL,
    "token_key" varchar(250) NOT NULL,
    "token_exp" integer NOT NULL DEFAULT 3600,
    "active" boolean NOT NULL DEFAULT TRUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ON domain("account_id", "name");
CREATE INDEX ON domain("name");
CREATE INDEX ON domain("active");
CREATE INDEX ON domain("created_at");
CREATE INDEX ON domain("updated_at");
ALTER TABLE domain OWNER TO galaxy;
-- ----------------------------------------------------------------------------
-- ROOM
-- ----------------------------------------------------------------------------
-- Each room should have a domain.
-- ----------------------------------------------------------------------------
CREATE TABLE room (
    "id" serial NOT NULL PRIMARY KEY,
    "domain_id" integer NOT NULL REFERENCES domain(id)
        ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "public" boolean NOT NULL DEFAULT FALSE,
    "active" boolean NOT NULL DEFAULT TRUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ON room("domain_id", "name");
CREATE INDEX ON room("name");
CREATE INDEX ON room("active");
CREATE INDEX ON room("created_at");
CREATE INDEX ON room("updated_at");
ALTER TABLE room OWNER TO galaxy;
-- ----------------------------------------------------------------------------
-- IDENTITY-ROOM
-- ----------------------------------------------------------------------------
-- (identity, room) pairs
-- ----------------------------------------------------------------------------
CREATE TABLE identity_room (
    "id" serial NOT NULL PRIMARY KEY,
    "identity_id" integer NOT NULL REFERENCES identity(id)
        ON DELETE CASCADE,
    "room_id" integer NOT NULL REFERENCES room(id)
        ON DELETE CASCADE,
    "token_exp" integer NOT NULL DEFAULT 0,
    "token_user_name" varchar(250) NOT NULL DEFAULT '',
    "token_user_email" varchar(250) NOT NULL DEFAULT '',
    "token_user_avatar" varchar(250) NOT NULL DEFAULT '',
    "token_user_affiliation" varchar(250) NOT NULL DEFAULT 'member',
    "active" boolean NOT NULL DEFAULT TRUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ON identity_room("identity_id", "room_id");
CREATE INDEX ON identity_room("identity_id");
CREATE INDEX ON identity_room("room_id");
CREATE INDEX ON identity_room("active");
CREATE INDEX ON identity_room("created_at");
CREATE INDEX ON identity_room("updated_at");
ALTER TABLE identity_room OWNER TO galaxy;
-- ----------------------------------------------------------------------------
-- MEMBERSHIP-REQUEST
-- account or identity -> room
-- keep status (seen, deny, deny permanently, allow etc)
-- maybe timeout for a second request
-- ----------------------------------------------------------------------------
-- MEMBERSHIP-PASSPORT
-- owner -> account or identity (for room)
-- ----------------------------------------------------------------------------

COMMIT;
