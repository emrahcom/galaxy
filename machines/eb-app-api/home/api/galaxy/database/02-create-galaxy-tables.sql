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
-- DOMAIN
-- -----------------------------------------------------------------------------
-- - public domain can only be added by system account.
-- - url depends on auth_type
-- -----------------------------------------------------------------------------
CREATE TYPE domain_auth_type AS ENUM
    ('none', 'token', 'moderated');
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
    "domain_id" uuid NOT NULL REFERENCES domain(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "has_suffix" boolean NOT NULL DEFAULT true,
    "suffix" varchar(250) NOT NULL DEFAULT md5(gen_random_uuid()::text),
    "ephemeral" boolean NOT NULL DEFAULT false,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "accessed_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON room("domain_id", "name");
ALTER TABLE room OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- MEETING
-- -----------------------------------------------------------------------------
-- - dont show the ephemeral meeting if it's over
-- - non-hidden meeting can be seen by everyone but permission will be needed to
--   participate it if it isn't common
-- - anybody can participate a common meeting if she has the access key
--   a common meeting may be hidden
-- - duration as minute in schedule_attr according to schedule_type
-- -----------------------------------------------------------------------------
CREATE TYPE meeting_schedule_type AS ENUM
    ('permanent', 'periodic', 'scheduled', 'ephemeral');
CREATE TABLE meeting (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "access_key" varchar(250) NOT NULL
        DEFAULT md5(random()::text) || md5(gen_random_uuid()::text),
    "room_id" uuid NOT NULL REFERENCES room(id) ON DELETE CASCADE,
    "title" varchar(250) NOT NULL,
    "info" varchar(2000) NOT NULL DEFAULT '',
    "schedule_type" meeting_schedule_type NOT NULL DEFAULT 'permanent',
    "schedule_attr" jsonb NOT NULL DEFAULT '{}'::jsonb,
    "scheduled_at" timestamp with time zone NOT NULL DEFAULT now(),
    "hidden" boolean NOT NULL DEFAULT true,
    "common" boolean NOT NULL DEFAULT true,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON meeting("access_key");
ALTER TABLE meeting OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- SCHEDULE
-- -----------------------------------------------------------------------------
-- - schedule doesn't contain permanent meetings
-- -----------------------------------------------------------------------------
CREATE TABLE schedule (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "meeting_id" uuid NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    "meeting_at" timestamp with time zone NOT NULL,
    "duration" integer NOT NULL,
    "ended_at" timestamp GENERATED ALWAYS AS
        (meeting_at + duration * interval '1 min') STORED,
);
CREATE INDEX ON schedule(meeting_id);
ALTER TABLE schedule OWNER TO galaxy;

-- -----------------------------------------------------------------------------
COMMIT;
