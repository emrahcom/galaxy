import { query } from "../common/database.ts";
import { notFound, ok } from "../common/http-response.ts";

const PRE = "/api/admin/identity";

// -----------------------------------------------------------------------------
export async function addIdentity(req: Deno.RequestEvent) {
  const pl = await req.request.json();
  const identityId = pl.identity_id;
  const sql = {
    text: `
      INSERT INTO identity (id)
      VALUES ($1)`,
    args: [
      identityId,
    ],
  };

  await query(sql);

  const body = {
    identityId: `${identityId}`,
  };

  ok(req, JSON.stringify(body));
}

// -----------------------------------------------------------------------------
export default async function (req: Deno.RequestEvent, path: string) {
  if (path === `${PRE}/add`) {
    await addIdentity(req);
  } else {
    notFound(req);
  }
}
