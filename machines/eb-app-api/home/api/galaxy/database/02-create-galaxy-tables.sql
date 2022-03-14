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
-- - contains the (key, value) pairs for miscellaneous use cases
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
-- - don't allow to delete the default profile
-- -----------------------------------------------------------------------------
CREATE TABLE profile (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "email" varchar(250) NOT NULL,
    "is_default" boolean NOT NULL DEFAULT false,
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
-- DOMAIN_PARTNER
-- -----------------------------------------------------------------------------
-- - identity cannot update enabled but she can delete the partnership
-- - domain owner can update enabled or delete the partnership
-- -----------------------------------------------------------------------------
CREATE TABLE domain_partner (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "domain_id" uuid NOT NULL REFERENCES domain(id) ON DELETE CASCADE,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON domain_partner("identity_id", "domain_id");
CREATE INDEX ON domain_partner("domain_id");
ALTER TABLE domain_partner OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- DOMAIN_INVITE
-- -----------------------------------------------------------------------------
-- - domain invite can only be used once by an identity, then it will be
--   disabled
-- -----------------------------------------------------------------------------
CREATE TABLE domain_invite (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "domain_id" uuid NOT NULL REFERENCES domain(id) ON DELETE CASCADE,
    "code" varchar(250) NOT NULL
        DEFAULT md5(random()::text) || md5(gen_random_uuid()::text),
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "expired_at" timestamp with time zone NOT NULL
      DEFAULT now() + interval '3 days'
);
CREATE UNIQUE INDEX ON domain_invite("code");
CREATE INDEX ON domain_invite("identity_id", "domain_id", "expired_at");
ALTER TABLE domain_invite OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- ROOM
-- -----------------------------------------------------------------------------
-- - update suffix if accessed_at is older than 4 hours
-- - dont show the room to the owner too if ephemeral is true
-- - ephemeral room name contains suffix in its name
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
-- ROOM_PARTNER
-- -----------------------------------------------------------------------------
-- - identity cannot update enabled but she can delete the partnership
-- - room owner can update enabled or delete the partnership
-- -----------------------------------------------------------------------------
CREATE TABLE room_partner (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "room_id" uuid NOT NULL REFERENCES room(id) ON DELETE CASCADE,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON room_partner("identity_id", "room_id");
CREATE INDEX ON room_partner("room_id");
ALTER TABLE room_partner OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- MEETING
-- -----------------------------------------------------------------------------
-- - dont show the ephemeral meeting if it's over
-- - show the scheduled meeting although it's over. it may be added a new date
-- - allow to change the schedule type if it is not ephemeral
-- - non-hidden meeting can be seen by everyone but permission will be needed to
--   participate it if it is restricted
-- - anybody can participate a restricted meeting if she has the key
-- - a non-restricted meeting may be hidden
-- - duration as minute in schedule_attr according to schedule_type
-- -----------------------------------------------------------------------------
CREATE TYPE meeting_schedule_type AS ENUM
    ('permanent', 'scheduled', 'ephemeral');
CREATE TABLE meeting (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "profile_id" uuid REFERENCES profile(id) ON DELETE SET NULL,
    "room_id" uuid NOT NULL REFERENCES room(id) ON DELETE CASCADE,
    "host_key" varchar(250) NOT NULL
        DEFAULT md5(random()::text) || md5(gen_random_uuid()::text),
    "guest_key" varchar(250) NOT NULL
        DEFAULT md5(random()::text) || md5(gen_random_uuid()::text),
    "name" varchar(250) NOT NULL,
    "info" varchar(2000) NOT NULL DEFAULT '',
    "schedule_type" meeting_schedule_type NOT NULL DEFAULT 'permanent',
    "schedule_attr" jsonb NOT NULL DEFAULT '{}'::jsonb,
    "hidden" boolean NOT NULL DEFAULT true,
    "restricted" boolean NOT NULL DEFAULT false,
    "subscribable" boolean NOT NULL DEFAULT true,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON meeting("host_key");
CREATE UNIQUE INDEX ON meeting("guest_key");
ALTER TABLE meeting OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- MEETING_MEMBER
-- -----------------------------------------------------------------------------
-- - identity cannot update enabled but she can delete the membership
-- - identity cannot update is_host
-- - meeting owner can update enabled or delete the membership
-- - meeting owner can update is_host
-- -----------------------------------------------------------------------------
CREATE TABLE meeting_member (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "meeting_id" uuid NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    "profile_id" uuid REFERENCES profile(id) ON DELETE SET NULL,
    "is_host" boolean NOT NULL DEFAULT false,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON meeting_member("identity_id", "meeting_id", "is_host");
CREATE INDEX ON meeting_member("meeting_id", "is_host");
ALTER TABLE meeting_member OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- MEETING_INVITE
-- -----------------------------------------------------------------------------
-- - meeting invite can be shared with multiple members and can be used multiple
--   times before the expire time
-- -----------------------------------------------------------------------------
CREATE TABLE meeting_invite (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "meeting_id" uuid NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    "code" varchar(250) NOT NULL
        DEFAULT md5(random()::text) || md5(gen_random_uuid()::text),
    "as_host" boolean NOT NULL DEFAULT false,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "expired_at" timestamp with time zone NOT NULL
      DEFAULT now() + interval '3 days'
);
CREATE UNIQUE INDEX ON meeting_invite("code");
CREATE INDEX ON meeting_invite("identity_id", "meeting_id", "expired_at");
ALTER TABLE meeting_invite OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- REQUEST
-- -----------------------------------------------------------------------------
-- - request can be created only if the meeting is subscribable and restricted.
--   if not restricted, no need the request, create membership immediately.
-- - when rejected, expired_at will be updated as now() + interval '7 days'
-- - identity owner can update the profile only if the status is pending
-- - identity owner can delete the request only if the status is pending
-- - meeting owner can delete the request anytimes
-- - delete all records which have expired_at older than now()
-- -----------------------------------------------------------------------------
CREATE TYPE request_status AS ENUM ('pending', 'rejected');
CREATE TABLE request (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "profile_id" uuid NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
    "meeting_id" uuid NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    "status" request_status NOT NULL DEFAULT 'pending',
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "expired_at" timestamp with time zone NOT NULL
      DEFAULT now() + interval '7 days'
);
CREATE UNIQUE INDEX ON request("identity_id", "meeting_id");
CREATE INDEX ON request("meeting_id", "status");
ALTER TABLE request OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- SCHEDULE
-- -----------------------------------------------------------------------------
-- - schedule doesn't contain permanent meetings
-- - ended_at = started_at + duration * interval '1 min'
-- -----------------------------------------------------------------------------
CREATE TABLE schedule (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "meeting_id" uuid NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    "started_at" timestamp with time zone NOT NULL,
    "duration" integer NOT NULL,
    "ended_at" timestamp with time zone NOT NULL
);
CREATE INDEX ON schedule(meeting_id);
ALTER TABLE schedule OWNER TO galaxy;

-- -----------------------------------------------------------------------------
COMMIT;
