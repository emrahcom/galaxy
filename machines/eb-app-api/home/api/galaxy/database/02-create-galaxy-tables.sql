-- -----------------------------------------------------------------------------
-- 02-CREATE-GALAXY-TABLES.SQL
-- -----------------------------------------------------------------------------
-- This script creates the database tables.
-- Tested on Postgresql 13.
--
-- Usage:
--     psql -l postgres -c \
--             "psql -d galaxy -e -f /tmp/02-create-galaxy-tables.sql"
--
--     psql -U galaxy -h postgres -d galaxy -e -f 02-create-galaxy-tables.sql
--
-- -----------------------------------------------------------------------------

BEGIN;

-- -----------------------------------------------------------------------------
-- PARAM
-- -----------------------------------------------------------------------------
-- The (key, value) pairs.
-- -----------------------------------------------------------------------------
CREATE TABLE param (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "key" varchar(50) NOT NULL,
    "value" varchar(250) NOT NULL
);
CREATE UNIQUE INDEX ON param("key");
ALTER TABLE param OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- IDENTITY
-- -----------------------------------------------------------------------------
CREATE TABLE identity (
    "id" uuid NOT NULL PRIMARY KEY,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX ON identity("enabled");
CREATE INDEX ON identity("created_at");
CREATE INDEX ON identity("updated_at");
ALTER TABLE identity OWNER TO galaxy;

INSERT INTO identity
    ('00000000-0000-0000-0000-000000000000', true, default, default);

-- -----------------------------------------------------------------------------
-- DOMAIN
-- -----------------------------------------------------------------------------
-- - public domain can only be added by system account.
-- -----------------------------------------------------------------------------
CREATE TYPE domain_auth_type AS ENUM
    ('none', 'token', 'moderated');
CREATE TABLE domain (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "auth_type" domain_auth_type NOT NULL DEFAULT 'none',
    "attributes" jsonb NOT NULL DEFAULT '{}'::jsonb,
    "public" boolean NOT NULL DEFAULT false,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON domain("identity_id", "name");
CREATE INDEX ON domain("name");
CREATE INDEX ON domain("auth_type");
CREATE INDEX ON domain("public");
CREATE INDEX ON domain("enabled");
CREATE INDEX ON domain("created_at");
CREATE INDEX ON domain("updated_at");
ALTER TABLE domain OWNER TO galaxy;

INSERT INTO domain
    (default, '00000000-0000-0000-0000-000000000000', 'meet.jit.si', 'none',
     '{"url": "https://meet.jit.si"}'::jsonb, true, true, default, default);

-- -----------------------------------------------------------------------------
-- ROOM
-- -----------------------------------------------------------------------------
-- - update suffix if accessed_at is older than 6 hours
-- - dont show the room to the owner too if ephemeral is true
-- - ephemeral room has no suffix but a hashed uuid inside its name
-- -----------------------------------------------------------------------------
CREATE TABLE room (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "domain_id" uuid NOT NULL REFERENCES domain(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "has_suffix" boolean NOT NULL DEFAULT true,
    "suffix" uuid NOT NULL DEFAULT gen_random_uuid(),
    "ephemeral" boolean NOT NULL DEFAULT false,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "accessed_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON room("domain_id", "name");
CREATE INDEX ON room("name");
CREATE INDEX ON room("ephemeral");
CREATE INDEX ON room("enabled");
CREATE INDEX ON room("created_at");
CREATE INDEX ON room("updated_at");
CREATE INDEX ON room("accessed_at");
ALTER TABLE room OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- MEETING
-- -----------------------------------------------------------------------------
-- - dont show the ephemeral meeting to the owner too, if it's over
-- - duration as minute
-- - subscription, how?
-- - visibility, how?
-- - accessibility, how?
-- - description
-- -----------------------------------------------------------------------------
CREATE TYPE meeting_schedule_type AS ENUM
    ('permanent', 'periodic', 'scheduled', 'ephemeral');
CREATE TABLE meeting (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "access_key" varchar(250) NOT NULL
        DEFAULT md5(random()::text) || md5(gen_random_uuid()::text),
    "room_id" uuid NOT NULL REFERENCES room(id) ON DELETE CASCADE,
    "title" varchar(250) NOT NULL,
    "duration" integer NOT NULL DEFAULT 0,
    "schedule_type" room_schedule_type NOT NULL DEFAULT 'permanent',
    "attributes" jsonb NOT NULL DEFAULT '{}'::jsonb,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
);
CREATE UNIQUE INDEX ON meeting("access_key");
CREATE INDEX ON meeting("room_id");
CREATE INDEX ON meeting("title");
CREATE INDEX ON meeting("schedule_type");
CREATE INDEX ON meeting("enabled");
CREATE INDEX ON meeting("created_at");
CREATE INDEX ON meeting("updated_at");
ALTER TABLE meeting OWNER TO galaxy;

-- -----------------------------------------------------------------------------
COMMIT;
