import { getVersion, pool } from "../database/common.ts";

// -----------------------------------------------------------------------------
async function migrateTo2024092201() {
  const version = await getVersion();
  const upgradeTo = "20240922.01";

  if (version < upgradeTo) {
    console.log(`Upgrade database to ${upgradeTo}`);

    using client = await pool.connect();
    const trans = client.createTransaction("transaction");
    await trans.begin();

    let sql = {
      text: `
        ALTER TABLE identity
          ADD COLUMN IF NOT EXISTS
            "seen_at" timestamp with time zone NOT NULL DEFAULT now()`,
    };
    await trans.queryObject(sql);

    sql = {
      text: `
        UPDATE metadata
        SET mvalue='${upgradeTo}'
        WHERE mkey = 'database_version'`,
    };
    await trans.queryObject(sql);

    await trans.commit();
    console.log(`Upgraded to database ${upgradeTo}`);
  }
}

// -----------------------------------------------------------------------------
async function migrateTo2024092801() {
  const version = await getVersion();
  const upgradeTo = "20240928.01";

  if (version < upgradeTo) {
    console.log(`Upgrade database to ${upgradeTo}`);

    using client = await pool.connect();
    const trans = client.createTransaction("transaction");
    await trans.begin();

    let sql = {
      text: `
        CREATE TYPE intercom_status_type AS ENUM (
          'none',
          'seen',
          'accepted',
          'rejected'
        )`,
    };
    await trans.queryObject(sql);

    sql = {
      text: `
        CREATE TYPE intercom_message_type AS ENUM (
          'call',
          'alarm_for_meeting',
          'invite_for_domain',
          'invite_for_room',
          'invite_for_meeting',
          'request_for_meeting_membership'
        )`,
    };
    await trans.queryObject(sql);

    sql = {
      text: `
        CREATE TABLE intercom (
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
    };
    await trans.queryObject(sql);

    sql = {
      text: `
        CREATE INDEX ON intercom("remote_id", "expired_at")`,
    };
    await trans.queryObject(sql);

    sql = {
      text: `
        CREATE INDEX ON intercom("expired_at")`,
    };
    await trans.queryObject(sql);

    sql = {
      text: `
        UPDATE metadata
        SET mvalue='${upgradeTo}'
        WHERE mkey = 'database_version'`,
    };
    await trans.queryObject(sql);

    await trans.commit();
    console.log(`Upgraded to database ${upgradeTo}`);
  }
}

// -----------------------------------------------------------------------------
export default async function () {
  console.log("migration...");

  const version = await getVersion();
  console.log(`Database version: ${version}`);

  await migrateTo2024092201();
  await migrateTo2024092801();
}
