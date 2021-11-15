import { query } from "../common/database.ts";
import { notFound, ok } from "../common/http-response.ts";

const PRE = "/api/private/domain";

// -----------------------------------------------------------------------------
export async function addDomain(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const sql = {
    text: `
      INSERT INTO domain (identity_id, name, auth_type, attributes)
      VALUES ($1, $2, $3, $4::jsonb)`,
    args: [
      identityId,
      pl.name,
      pl.auth_type,
      pl.attributes,
    ],
  };
  const id = await query(sql)
    .then((rst) => {
      return rst.rows[0].id;
    });
  const body = {
    domainId: `${id}`,
  };

  ok(req, JSON.stringify(body));
}

// -----------------------------------------------------------------------------
export default function (req: Deno.RequestEvent, identityId: string) {
  if (path === `${PRE}/add`) {
    addDomain(req, identityId);
  } else {
    notFound(req);
  }
}
