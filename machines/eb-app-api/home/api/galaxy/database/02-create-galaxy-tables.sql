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
    "enabled" boolean NOT NULL DEFAULT TRUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW()
);
CREATE INDEX ON identity("enabled");
CREATE INDEX ON identity("created_at");
CREATE INDEX ON identity("updated_at");
ALTER TABLE identity OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- DOMAIN
-- -----------------------------------------------------------------------------
CREATE TYPE domain_auth_type AS ENUM
    ('none', 'token', 'moderated');
CREATE TABLE domain (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "auth_type" domain_auth_type NOT NULL DEFAULT 'none',
    "attributes" jsonb NOT NULL DEFAULT '{}'::jsonb,
    "enabled" boolean NOT NULL DEFAULT TRUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ON domain("identity_id", "name");
CREATE INDEX ON domain("name");
CREATE INDEX ON domain("auth_type");
CREATE INDEX ON domain("enabled");
CREATE INDEX ON domain("created_at");
CREATE INDEX ON domain("updated_at");
ALTER TABLE domain OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- ROOM
-- -----------------------------------------------------------------------------
-- - update suffix if accessed_at is older than 6 hours
-- - dont show name to others, always use title as display name or description
-- - room schedule, how?
-- - subscription, how?
-- - visibility, how?
-- - accessibility, how?
-- -----------------------------------------------------------------------------
CREATE TYPE room_schedule_type AS ENUM
    ('permanent', 'scheduled', 'periodic');
CREATE TABLE room (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "domain_id" uuid NOT NULL REFERENCES domain(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "title" varchar(250) NOT NULL,
    "has_suffix" boolean NOT NULL DEFAULT TRUE,
    "suffix" uuid NOT NULL DEFAULT gen_random_uuid(),
    "schedule_type" room_schedule_type NOT NULL,
    "schedule" jsonb NOT NULL DEFAULT '{}'::jsonb,
    "enabled" boolean NOT NULL DEFAULT TRUE,
    "created_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT NOW(),
    "accessed_at" timestamp with time zone NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX ON room("domain_id", "name");
CREATE INDEX ON room("name");
CREATE INDEX ON room("title");
CREATE INDEX ON room("enabled");
CREATE INDEX ON room("created_at");
CREATE INDEX ON room("updated_at");
ALTER TABLE room OWNER TO galaxy;

-- -----------------------------------------------------------------------------
COMMIT;
