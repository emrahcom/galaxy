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
-- CONTACT
-- -----------------------------------------------------------------------------
CREATE TABLE contact (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "remote_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON contact("identity_id", "remote_id");
CREATE INDEX ON contact("identity_id", "name");
ALTER TABLE contact OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- DOMAIN
-- -----------------------------------------------------------------------------
-- - public domain can only be added by system account
-- - auth_type of public domain must be 'none' (to decrease complexity)
-- - only none, token and jaas are supported as auth_type
-- - urls are in domain_attr depending on auth_type
-- -----------------------------------------------------------------------------
CREATE TYPE domain_auth_type AS ENUM ('none', 'token', 'jaas');
CREATE TABLE domain (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "auth_type" domain_auth_type NOT NULL DEFAULT 'none',
    "domain_attr" jsonb NOT NULL DEFAULT '{}'::jsonb,
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
-- DOMAIN_INVITE
-- -----------------------------------------------------------------------------
-- - domain invite can only be used once, then it will be disabled
-- - needs a unique invite for each partner
-- -----------------------------------------------------------------------------
CREATE TABLE domain_invite (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "domain_id" uuid NOT NULL REFERENCES domain(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
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
-- ROOM
-- -----------------------------------------------------------------------------
-- - update suffix if accessed_at is older than 4 hours
-- - dont show the room to the owner if ephemeral is true
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
    "accessed_at" timestamp with time zone NOT NULL DEFAULT now(),
    "attendance" integer NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX ON room("identity_id", "domain_id", "name");
CREATE INDEX ON room("identity_id", "ephemeral");
ALTER TABLE room OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- ROOM_INVITE
-- -----------------------------------------------------------------------------
-- - room invite can only be used once, then it will be disabled
-- - needs a unique invite for each partner
-- -----------------------------------------------------------------------------
CREATE TABLE room_invite (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "room_id" uuid NOT NULL REFERENCES room(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "code" varchar(250) NOT NULL
        DEFAULT md5(random()::text) || md5(gen_random_uuid()::text),
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "expired_at" timestamp with time zone NOT NULL
      DEFAULT now() + interval '3 days'
);
CREATE UNIQUE INDEX ON room_invite("code");
CREATE INDEX ON room_invite("identity_id", "room_id", "expired_at");
ALTER TABLE room_invite OWNER TO galaxy;

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
-- - ephemeral will be over 4 hours after the room's accessed_at
-- - show the scheduled meeting although it's over. it may be added a new date
-- - allow to change the schedule type if it is not ephemeral
-- - non-hidden meeting can be seen by everyone but permission will be needed to
--   participate it if it is restricted
-- - anybody can participate a restricted meeting if she has the audience key
-- - a non-restricted meeting may be hidden
-- -----------------------------------------------------------------------------
CREATE TYPE meeting_schedule_type AS ENUM
    ('permanent', 'scheduled', 'ephemeral');
CREATE TABLE meeting (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "profile_id" uuid REFERENCES profile(id) ON DELETE SET NULL,
    "room_id" uuid NOT NULL REFERENCES room(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "info" varchar(2000) NOT NULL DEFAULT '',
    "schedule_type" meeting_schedule_type NOT NULL DEFAULT 'permanent',
    "hidden" boolean NOT NULL DEFAULT true,
    "restricted" boolean NOT NULL DEFAULT false,
    "subscribable" boolean NOT NULL DEFAULT true,
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "accessed_at" timestamp with time zone NOT NULL DEFAULT now(),
    "attendance" integer NOT NULL DEFAULT 0
);
CREATE INDEX ON meeting(identity_id, schedule_type);
ALTER TABLE meeting OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- MEETING_INVITE
-- -----------------------------------------------------------------------------
-- - meeting invite can be shared with multiple member candidates and can be
--   used multiple times before the expire time if it is not disposable
-- - audience invite is not disposable
-- -----------------------------------------------------------------------------
CREATE TYPE meeting_invite_type AS ENUM ('audience', 'member');
CREATE TYPE meeting_affiliation_type AS ENUM ('guest', 'host');
CREATE TABLE meeting_invite (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "meeting_id" uuid NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL,
    "code" varchar(250) NOT NULL
        DEFAULT md5(random()::text) || md5(gen_random_uuid()::text),
    "invite_to" meeting_invite_type NOT NULL DEFAULT 'audience',
    "join_as" meeting_affiliation_type NOT NULL DEFAULT 'guest',
    "disposable" boolean NOT NULL DEFAULT true,
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
-- MEETING_REQUEST
-- -----------------------------------------------------------------------------
-- - request can be created only if the meeting is subscribable and restricted.
--   if not restricted, no need the request, create membership immediately.
-- - when rejected, expired_at will be updated as now() + interval '7 days'
-- - identity owner can update the profile only if the status is pending
-- - identity owner can delete the request only if the status is pending
-- - meeting owner can delete the request anytimes
-- - delete all records which have expired_at older than now()
-- -----------------------------------------------------------------------------
CREATE TYPE meeting_request_status AS ENUM ('pending', 'rejected');
CREATE TABLE meeting_request (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "profile_id" uuid NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
    "meeting_id" uuid NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    "status" meeting_request_status NOT NULL DEFAULT 'pending',
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
    "expired_at" timestamp with time zone NOT NULL
      DEFAULT now() + interval '7 days'
);
CREATE UNIQUE INDEX ON meeting_request("identity_id", "meeting_id");
CREATE INDEX ON meeting_request("meeting_id", "status");
ALTER TABLE meeting_request OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- MEETING_MEMBER
-- -----------------------------------------------------------------------------
-- - identity cannot update enabled but she can delete the membership
-- - identity cannot update join_as
-- - meeting owner can update enabled or delete the membership
-- - meeting owner can update join_as
-- -----------------------------------------------------------------------------
CREATE TABLE meeting_member (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
    "meeting_id" uuid NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    "profile_id" uuid REFERENCES profile(id) ON DELETE SET NULL,
    "join_as" meeting_affiliation_type NOT NULL DEFAULT 'guest',
    "enabled" boolean NOT NULL DEFAULT true,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX ON meeting_member("identity_id", "meeting_id", "join_as");
ALTER TABLE meeting_member OWNER TO galaxy;

-- -----------------------------------------------------------------------------
-- MEETING_SCHEDULE
-- -----------------------------------------------------------------------------
-- - schedule contains scheduled meetings only
-- - ended_at = started_at + duration * interval '1 min'
-- -----------------------------------------------------------------------------
CREATE TABLE meeting_schedule (
    "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "meeting_id" uuid NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    "name" varchar(250) NOT NULL DEFAULT '',
    "started_at" timestamp with time zone NOT NULL,
    "duration" integer NOT NULL,
    "ended_at" timestamp with time zone NOT NULL
);
CREATE INDEX ON meeting_schedule(meeting_id, started_at);
CREATE INDEX ON meeting_schedule(meeting_id, ended_at);
ALTER TABLE meeting_schedule OWNER TO galaxy;

-- -----------------------------------------------------------------------------
COMMIT;
