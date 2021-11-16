import { idRows, query } from "../common/database.ts";
import { internalServerError, notFound, ok } from "../common/http-response.ts";

const PRE = "/api/pri/domain";

// -----------------------------------------------------------------------------
export async function addDomain(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        INSERT INTO domain (identity_id, name, auth_type, attributes)
        VALUES ($1, $2, $3, $4::jsonb)
        RETURNING id`,
      args: [
        identityId,
        pl.name,
        pl.auth_type,
        pl.attributes,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as idRows;
      });
    const body = {
      domainId: rows[0].id,
    };

    ok(req, JSON.stringify(body));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export default function (
  req: Deno.RequestEvent,
  path: string,
  identityId: string,
) {
  if (path === `${PRE}/add`) {
    addDomain(req, identityId);
  } else {
    notFound(req);
  }
}
