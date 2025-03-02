import { getVersion, pool } from "../database/common.ts";
import type { QueryObject } from "../database/common.ts";

// -----------------------------------------------------------------------------
// Migrate template.
// -----------------------------------------------------------------------------
async function migrateTo(upgradeTo: string, sqls: (string | QueryObject)[]) {
  const version = await getVersion();

  if (version < upgradeTo) {
    console.log(`Upgrade database to ${upgradeTo}`);

    using client = await pool.connect();
    const trans = client.createTransaction("transaction");
    await trans.begin();

    // run migration sqls
    for (const sql of sqls) {
      if (typeof sql === "string") {
        await trans.queryObject(sql as string);
      } else {
        await trans.queryObject(sql as QueryObject);
      }
    }

    // set the new version in metadata
    const versionSql = `
      UPDATE metadata
        SET mvalue='${upgradeTo}'
        WHERE mkey = 'database_version'`;
    await trans.queryObject(versionSql);

    await trans.commit();
    console.log(`Upgraded to database ${upgradeTo}`);
  }
}

// -----------------------------------------------------------------------------
async function migrateTo2024092201() {
  const upgradeTo = "20240922.01";
  const sqls = [
    `ALTER TABLE identity
       ADD COLUMN IF NOT EXISTS
         "seen_at" timestamp with time zone NOT NULL DEFAULT now()`,
  ];

  await migrateTo(upgradeTo, sqls);
}

// -----------------------------------------------------------------------------
async function migrateTo2024092801() {
  const upgradeTo = "20240928.01";
  const sqls = [
    `CREATE TYPE intercom_status_type AS ENUM (
       'none',
       'seen',
       'accepted',
       'rejected'
     )`,

    `CREATE TYPE intercom_message_type AS ENUM (
       'call',
       'alarm_for_meeting',
       'invite_for_domain',
       'invite_for_room',
       'invite_for_meeting',
       'request_for_meeting_membership'
     )`,

    `CREATE TABLE intercom (
       "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
       "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
       "remote_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
       "status" intercom_status_type NOT NULL DEFAULT 'none',
       "message_type" intercom_message_type NOT NULL DEFAULT 'call',
       "intercom_attr" jsonb NOT NULL DEFAULT '{}'::jsonb,
       "created_at" timestamp with time zone NOT NULL DEFAULT now(),
       "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
       "expired_at" timestamp with time zone NOT NULL
           DEFAULT now() + interval '10 seconds'
     )`,

    `CREATE INDEX ON intercom("remote_id", "expired_at")`,

    `CREATE INDEX ON intercom("expired_at")`,
  ];

  await migrateTo(upgradeTo, sqls);
}

// -----------------------------------------------------------------------------
async function migrateTo2024101501() {
  const upgradeTo = "20241015.01";
  const sqls = [
    `CREATE TABLE contact_invite (
       "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
       "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
       "name" varchar(250) NOT NULL,
       "code" varchar(250) NOT NULL
           DEFAULT md5(random()::text) || md5(gen_random_uuid()::text),
       "disposable" boolean NOT NULL DEFAULT true,
       "enabled" boolean NOT NULL DEFAULT true,
       "created_at" timestamp with time zone NOT NULL DEFAULT now(),
       "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
       "expired_at" timestamp with time zone NOT NULL
           DEFAULT now() + interval '3 days'
     )`,

    `CREATE UNIQUE INDEX ON contact_invite("code")`,

    `CREATE INDEX ON contact_invite("identity_id", "expired_at")`,

    `CREATE INDEX ON contact_invite("expired_at")`,

    `CREATE INDEX ON domain_invite("expired_at")`,

    `CREATE INDEX ON room_invite("expired_at")`,

    `CREATE INDEX ON meeting_invite("expired_at")`,

    `CREATE INDEX ON meeting_request("expired_at")`,

    `CREATE INDEX ON meeting_session("ended_at")`,
  ];

  await migrateTo(upgradeTo, sqls);
}

// -----------------------------------------------------------------------------
async function migrateTo2024110301() {
  const upgradeTo = "20241103.01";
  const sqls = [
    `ALTER TABLE identity
       ADD COLUMN IF NOT EXISTS
         "identity_attr" jsonb NOT NULL DEFAULT '{}'::jsonb`,
  ];

  await migrateTo(upgradeTo, sqls);
}

// -----------------------------------------------------------------------------
async function migrateTo2024111601() {
  const upgradeTo = "20241116.01";
  const sqls = [
    `CREATE INDEX ON meeting_session("started_at")`,
  ];

  await migrateTo(upgradeTo, sqls);
}

// -----------------------------------------------------------------------------
async function migrateTo2024112301() {
  const upgradeTo = "20241123.01";
  const sqls = [
    `DROP TABLE intercom`,

    `DROP TYPE intercom_message_type`,

    `CREATE TYPE intercom_message_type AS ENUM (
       'call',
       'phone'
     )`,

    `CREATE TABLE intercom (
       "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
       "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
       "remote_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
       "status" intercom_status_type NOT NULL DEFAULT 'none',
       "message_type" intercom_message_type NOT NULL DEFAULT 'call',
       "intercom_attr" jsonb NOT NULL DEFAULT '{}'::jsonb,
       "created_at" timestamp with time zone NOT NULL DEFAULT now(),
       "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
       "expired_at" timestamp with time zone NOT NULL
           DEFAULT now() + interval '10 seconds'
     )`,

    `CREATE INDEX ON intercom("remote_id", "expired_at")`,

    `CREATE INDEX ON intercom("expired_at")`,

    `CREATE TABLE phone (
       "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
       "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
       "profile_id" uuid REFERENCES profile(id) ON DELETE SET NULL,
       "domain_id" uuid NOT NULL REFERENCES domain(id) ON DELETE CASCADE,
       "name" varchar(250) NOT NULL,
       "code" varchar(250) NOT NULL
           DEFAULT md5(random()::text) || md5(gen_random_uuid()::text),
       "email_enabled" boolean NOT NULL DEFAULT true,
       "enabled" boolean NOT NULL DEFAULT true,
       "created_at" timestamp with time zone NOT NULL DEFAULT now(),
       "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
       "called_at" timestamp with time zone NOT NULL DEFAULT now(),
       "calls" integer NOT NULL DEFAULT 0
     )`,

    `CREATE UNIQUE INDEX ON phone("code")`,

    `CREATE INDEX ON phone("identity_id", "name")`,
  ];

  await migrateTo(upgradeTo, sqls);
}

// -----------------------------------------------------------------------------
async function migrateTo2024120701() {
  const upgradeTo = "20241207.01";
  const sqls = [
    `ALTER TABLE meeting
       ALTER COLUMN profile_id SET NOT NULL`,

    `ALTER TABLE meeting
       DROP CONSTRAINT "meeting_profile_id_fkey"`,

    `ALTER TABLE meeting
       ADD CONSTRAINT "meeting_profile_id_fkey"
       FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE NO ACTION
       NOT VALID`,

    `ALTER TABLE meeting
       VALIDATE CONSTRAINT "meeting_profile_id_fkey"`,

    `ALTER TABLE meeting_request
       ALTER COLUMN profile_id SET NOT NULL`,

    `ALTER TABLE meeting_request
       DROP CONSTRAINT "meeting_request_profile_id_fkey"`,

    `ALTER TABLE meeting_request
       ADD CONSTRAINT "meeting_request_profile_id_fkey"
       FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE NO ACTION
       NOT VALID`,

    `ALTER TABLE meeting_request
       VALIDATE CONSTRAINT "meeting_request_profile_id_fkey"`,

    `ALTER TABLE meeting_member
       ALTER COLUMN profile_id SET NOT NULL`,

    `ALTER TABLE meeting_member
       DROP CONSTRAINT "meeting_member_profile_id_fkey"`,

    `ALTER TABLE meeting_member
       ADD CONSTRAINT "meeting_member_profile_id_fkey"
       FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE NO ACTION
       NOT VALID`,

    `ALTER TABLE meeting_member
       VALIDATE CONSTRAINT "meeting_member_profile_id_fkey"`,

    `ALTER TABLE phone
       ALTER COLUMN profile_id SET NOT NULL`,

    `ALTER TABLE phone
       DROP CONSTRAINT "phone_profile_id_fkey"`,

    `ALTER TABLE phone
       ADD CONSTRAINT "phone_profile_id_fkey"
       FOREIGN KEY (profile_id) REFERENCES profile(id) ON DELETE NO ACTION
       NOT VALID`,

    `ALTER TABLE phone
       VALIDATE CONSTRAINT "phone_profile_id_fkey"`,
  ];

  await migrateTo(upgradeTo, sqls);
}

// -----------------------------------------------------------------------------
async function migrateTo2024122201() {
  const upgradeTo = "20241222.01";
  const sqls = [
    `CREATE TABLE identity_key (
       "id" uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
       "identity_id" uuid NOT NULL REFERENCES identity(id) ON DELETE CASCADE,
       "domain_id" uuid NOT NULL REFERENCES domain(id) ON DELETE CASCADE,
       "name" varchar(250) NOT NULL,
       "value" varchar(250) NOT NULL
         DEFAULT md5(random()::text) || md5(gen_random_uuid()::text),
       "enabled" boolean NOT NULL DEFAULT true,
       "created_at" timestamp with time zone NOT NULL DEFAULT now(),
       "updated_at" timestamp with time zone NOT NULL DEFAULT now()
     )`,

    `CREATE UNIQUE INDEX ON identity_key("value")`,

    `CREATE INDEX ON identity_key("identity_id", "name")`,
  ];

  await migrateTo(upgradeTo, sqls);
}

// -----------------------------------------------------------------------------
async function migrateTo2025030201() {
  const upgradeTo = "20250302.01";
  const sqls = [
    `ALTER TABLE contact
       ADD COLUMN IF NOT EXISTS
         "visible" boolean NOT NULL DEFAULT true`,
  ];

  await migrateTo(upgradeTo, sqls);
}

// -----------------------------------------------------------------------------
export default async function () {
  console.log("migration...");

  const version = await getVersion();
  console.log(`Database version: ${version}`);

  await migrateTo2024092201();
  await migrateTo2024092801();
  await migrateTo2024101501();
  await migrateTo2024110301();
  await migrateTo2024111601();
  await migrateTo2024112301();
  await migrateTo2024120701();
  await migrateTo2024122201();
  await migrateTo2025030201();
}
