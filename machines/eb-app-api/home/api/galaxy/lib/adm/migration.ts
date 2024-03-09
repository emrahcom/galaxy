import { getVersion } from "../database/common.ts";

// -----------------------------------------------------------------------------
export default async function () {
  console.log("migration...");

  const version = await getVersion();
  console.log(`Database version: ${version}`);
}
