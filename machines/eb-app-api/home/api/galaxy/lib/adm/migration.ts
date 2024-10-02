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

    for (const sql of sqls) {
      if (typeof sql === "string") {
        await trans.queryObject(sql as string);
      } else {
        await trans.queryObject(sql as QueryObject);
      }
    }

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

    `UPDATE metadata
       SET mvalue='${upgradeTo}'
       WHERE mkey = 'database_version'`,
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

    `UPDATE metadata
     SET mvalue='${upgradeTo}'
     WHERE mkey = 'database_version'`,
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
}
