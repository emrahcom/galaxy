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
ALTER TABLE identity OWNER TO galaxy;

-- system account
INSERT INTO identity VALUES (
    '00000000-0000-0000-0000-000000000000', true, default, default
);

-- -----------------------------------------------------------------------------
-- PROFILE
-- -----------------------------------------------------------------------------
CREATE TABLE profile (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "email" varchar(250) NOT NULL,
    "is_default" boolean NOT NULL DEFAULT false,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON profile("identity_id", "name", "email");
ALTER TABLE profile OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- DOMAIN
-- -----------------------------------------------------------------------------
-- - public domain can only be added by system account.
-- - auth_type of public domain must be 'none'
-- - urls are in auth_attr depending on auth_type
-- -----------------------------------------------------------------------------
CREATE TYPE domain_auth_type AS ENUM ('none', 'token');
CREATE TABLE domain (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "auth_type" domain_auth_type NOT NULL DEFAULT 'none',
    "auth_attr" jsonb NOT NULL DEFAULT '{}'::jsonb,
    "public" boolean NOT NULL DEFAULT false,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON domain("identity_id", "name");
CREATE INDEX ON domain("public");
ALTER TABLE domain OWNER TO galaxy;

INSERT INTO domain VALUES (
    default, '00000000-0000-0000-0000-000000000000', 'meet.jit.si', 'none',
    '{"url": "https://meet.jit.si"}'::jsonb, true, true, default, default
);

-- -----------------------------------------------------------------------------
-- ROOM
-- -----------------------------------------------------------------------------
-- - update suffix if accessed_at is older than 4 hours
-- - dont show the room to the owner too if ephemeral is true
-- - ephemeral room has no suffix but a hashed uuid inside its name
-- -----------------------------------------------------------------------------
CREATE TABLE room (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "domain_id" uuid NOT NULL REFERENCES domain(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL
        DEFAULT 'room-' || md5(gen_random_uuid()::text),
    "has_suffix" boolean NOT NULL DEFAULT false,
    "suffix" varchar(250) NOT NULL DEFAULT md5(gen_random_uuid()::text),
    "ephemeral" boolean NOT NULL DEFAULT true,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "accessed_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON room("identity_id", "domain_id", "name");
ALTER TABLE room OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- MEETING
-- -----------------------------------------------------------------------------
-- - dont show the ephemeral meeting if it's over
-- - dont allow to change schedule type after insert or only without ephemeral
-- - non-hidden meeting can be seen by everyone but permission will be needed to
--   participate it if it is restricted
-- - anybody can participate a restricted meeting if she has the key
-- - a non-restricted meeting may be hidden
-- - duration as minute in schedule_attr according to schedule_type
-- -----------------------------------------------------------------------------
CREATE TYPE meeting_schedule_type AS ENUM
    ('permanent', 'periodic', 'scheduled', 'ephemeral');
CREATE TABLE meeting (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "room_id" uuid NOT NULL REFERENCES room(id) ON DELETE CASCADE,
    "host_key" varchar(250) NOT NULL
        DEFAULT md5(random()::text) || md5(gen_random_uuid()::text),
    "guest_key" varchar(250) NOT NULL
        DEFAULT md5(random()::text) || md5(gen_random_uuid()::text),
    "name" varchar(250) NOT NULL,
    "info" varchar(2000) NOT NULL DEFAULT '',
    "schedule_type" meeting_schedule_type NOT NULL DEFAULT 'permanent',
    "schedule_attr" jsonb NOT NULL DEFAULT '{}'::jsonb,
    "scheduled_at" timestamp with time zone NOT NULL DEFAULT now(),
    "hidden" boolean NOT NULL DEFAULT true,
    "restricted" boolean NOT NULL DEFAULT false,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON meeting("host_key");
CREATE UNIQUE INDEX ON meeting("guest_key");
ALTER TABLE meeting OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- SCHEDULE
-- -----------------------------------------------------------------------------
-- - schedule doesn't contain permanent meetings
-- - end_at = start_at + duration * interval '1 min'
-- -----------------------------------------------------------------------------
CREATE TABLE schedule (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "meeting_id" uuid NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    "start_at" timestamp with time zone NOT NULL,
    "duration" integer NOT NULL,
    "end_at" timestamp with time zone NOT NULL
);
CREATE INDEX ON schedule(meeting_id);
ALTER TABLE schedule OWNER TO galaxy;

-- -----------------------------------------------------------------------------
COMMIT;
