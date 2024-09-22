import { fetch } from "./common.ts";
import type { Id } from "./types.ts";

// -----------------------------------------------------------------------------
export async function updatePresence(identityId: string) {
  const sql = {
    text: `
      UPDATE identity
      SET
        seen_at = now()
      WHERE id = $1
      RETURNING id, seen_at as at`,
    args: [
      identityId,
    ],
  };

  return await fetch(sql) as Id[];
}
