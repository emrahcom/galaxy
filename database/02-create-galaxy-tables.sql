-- ----------------------------------------------------------------------------
-- 02-CREATE-GALAXY-TABLES.SQL
-- ----------------------------------------------------------------------------
-- This script creates the database tables.
-- Tested on Postgresql 11.
--
-- Usage:
--     psql -l postgres -c \
--             "psql -d galaxy -e -f /tmp/02-create-galaxy-tables.sql"
--
--     psql -U galaxy -h postgres -d galaxy -e -f 02-create-galaxy-tables.sql
--
-- ----------------------------------------------------------------------------

BEGIN;

-- ----------------------------------------------------------------------------
-- PARAM
-- ----------------------------------------------------------------------------
-- The (key, value) pairs.
-- ----------------------------------------------------------------------------
CREATE TABLE param (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "key" varchar(50) NOT NULL,
    "value" varchar(250) NOT NULL
);
CREATE UNIQUE INDEX ON param("key");
ALTER TABLE param OWNER TO galaxy;
-- ----------------------------------------------------------------------------
-- IDENTITY
-- ----------------------------------------------------------------------------
CREATE TABLE identity (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" varchar(250) NOT NULL,
    "passwd" varchar(250) NOT NULL,
    "active" boolean NOT NULL DEFAULT TRUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ON identity("email");
CREATE INDEX ON identity("active");
CREATE INDEX ON identity("created_at");
CREATE INDEX ON identity("updated_at");
ALTER TABLE identity OWNER TO galaxy;
-- ----------------------------------------------------------------------------
-- PROFILE
-- ----------------------------------------------------------------------------
CREATE TABLE profile (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id)
        ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "email" varchar(250) NOT NULL,
    "avatar" varchar(250) NOT NULL DEFAULT '',
    "default" boolean NOT NULL DEFAULT FALSE,
    "active" boolean NOT NULL DEFAULT TRUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW()
);
CREATE INDEX ON profile("name");
CREATE INDEX ON profile("email");
CREATE INDEX ON profile("default");
CREATE INDEX ON profile("active");
CREATE INDEX ON profile("created_at");
CREATE INDEX ON profile("updated_at");
ALTER TABLE profile OWNER TO galaxy;
-- ----------------------------------------------------------------------------
-- DOMAIN
-- ----------------------------------------------------------------------------
-- Each domain should have an owner.
-- ----------------------------------------------------------------------------
CREATE TYPE domain_auth_type AS ENUM ('none', 'token', 'custom');
CREATE TABLE domain (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id)
        ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "link" varchar(250) NOT NULL,
    "auth_type" domain_auth_type NOT NULL DEFAULT 'none',
    "active" boolean NOT NULL DEFAULT TRUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ON domain("identity_id", "name");
CREATE INDEX ON domain("name");
CREATE INDEX ON domain("auth_type");
CREATE INDEX ON domain("active");
CREATE INDEX ON domain("created_at");
CREATE INDEX ON domain("updated_at");
ALTER TABLE domain OWNER TO galaxy;

--     "token_aud" varchar(250) NOT NULL DEFAULT '',
--     "token_key" varchar(250) NOT NULL DEFAULT '',
--     "token_exp" integer NOT NULL DEFAULT 3600,

-- ----------------------------------------------------------------------------
-- ROOM
-- ----------------------------------------------------------------------------
-- Each room should have a domain.
-- ?when room name will be changed in randomized mode (X min after last access)
-- requestable: people can send the subscribtion request
-- hidden: the owner may send the invite to the people
-- ----------------------------------------------------------------------------
CREATE TYPE room_name_type AS ENUM ('static', 'randomized');
CREATE TYPE room_visibility AS ENUM ('public', 'members', 'hidden');
CREATE TYPE room_accessibility AS ENUM ('everyone', 'allowed');
CREATE TABLE room (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "domain_id" uuid NOT NULL REFERENCES domain(id)
        ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "name_type" room_name_type NOT NULL DEFAULT 'randomized',
    "visibility" room_visibility NOT NULL DEFAULT 'public',
    "accessibility" room_accessibility NOT NULL DEFAULT 'everyone',
    "requestable" boolean NOT NULL DEFAULT TRUE,
    "active" boolean NOT NULL DEFAULT TRUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "accessed_at" timestamp with time zone NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ON room("domain_id", "name");
CREATE INDEX ON room("name");
CREATE INDEX ON room("visibility");
CREATE INDEX ON room("accessibility");
CREATE INDEX ON room("requestable");
CREATE INDEX ON room("active");
CREATE INDEX ON room("created_at");
CREATE INDEX ON room("updated_at");
CREATE INDEX ON room("accessed_at");
ALTER TABLE room OWNER TO galaxy;
-- ----------------------------------------------------------------------------
-- PROFILE-ROOM
-- ----------------------------------------------------------------------------
-- (profile, room) pairs
-- ----------------------------------------------------------------------------
CREATE TABLE profile_room (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "profile_id" uuid NOT NULL REFERENCES profile(id)
        ON DELETE CASCADE,
    "room_id" uuid NOT NULL REFERENCES room(id)
        ON DELETE CASCADE,
    "active" boolean NOT NULL DEFAULT TRUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ON profile_room("profile_id", "room_id");
CREATE INDEX ON profile_room("profile_id");
CREATE INDEX ON profile_room("room_id");
CREATE INDEX ON profile_room("active");
CREATE INDEX ON profile_room("created_at");
CREATE INDEX ON profile_room("updated_at");
ALTER TABLE profile_room OWNER TO galaxy;

--    "token_exp" integer NOT NULL DEFAULT 0,
--    "token_user_name" varchar(250) NOT NULL DEFAULT '',
--    "token_user_email" varchar(250) NOT NULL DEFAULT '',
--    "token_user_avatar" varchar(250) NOT NULL DEFAULT '',
--    "token_user_affiliation" varchar(250) NOT NULL DEFAULT 'member',

-- ----------------------------------------------------------------------------
-- MEMBERSHIP-REQUEST
-- identity or profile -> room
-- keep status (seen, deny, deny permanently, allow etc)
-- maybe timeout for a second request
-- ----------------------------------------------------------------------------
-- MEMBERSHIP-INVITE
-- owner -> identity or profile (for room)
-- ----------------------------------------------------------------------------

COMMIT;
