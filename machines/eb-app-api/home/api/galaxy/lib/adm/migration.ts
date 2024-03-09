import { fetch } from "../database/common.ts";

// -----------------------------------------------------------------------------
async function getVersion() {
  const sql = {
    text: `
      SELECT mvalue
      FROM metadata
      WHERE mkey = 'database_version'`,
  };
  const rows = await fetch(sql) as string[];

  return rows[0];
}

// -----------------------------------------------------------------------------
export default async function () {
  console.log("migration...");

  const version = await getVersion();
  console.log(`Database version: ${version}`);
}
