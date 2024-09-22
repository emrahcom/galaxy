import { getVersion, pool } from "../database/common.ts";

// -----------------------------------------------------------------------------
async function migrateTo2024092201(version: string) {
  if (version < "20240922.01") {
    console.log("Upgrade database to 20240922.01");

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
        SET mvalue='20240922.01'
        WHERE mkey = 'database_version'`,
    };
    await trans.queryObject(sql);

    await trans.commit();
    console.log("Upgraded to database 20240922.01");
  }
}

// -----------------------------------------------------------------------------
export default async function () {
  console.log("migration...");

  const version = await getVersion();
  console.log(`Database version: ${version}`);

  await migrateTo2024092201(version);
}
