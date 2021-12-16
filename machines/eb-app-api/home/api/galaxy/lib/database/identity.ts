import { fetch, idRows } from "./common.ts";

// -----------------------------------------------------------------------------
export async function addIdentity(identityId: string) {
  const sql = {
    text: `
      INSERT INTO identity (id)
      VALUES ($1)
      RETURNING id, created_at as at`,
    args: [
      identityId,
    ],
  };

  return await fetch(sql) as idRows;
}
