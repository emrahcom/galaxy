import { idRows, query } from "../common/database.ts";
import { internalServerError, notFound, ok } from "../common/http-response.ts";

const PRE = "/api/admin/identity";

// -----------------------------------------------------------------------------
export async function addIdentity(req: Deno.RequestEvent) {
  try {
    const pl = await req.request.json();
    const identityId = pl.identity_id;
    const sql = {
      text: `
        INSERT INTO identity (id)
        VALUES ($1)
        RETURNING id`,
      args: [
        identityId,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as idRows;
      });
    const body = {
      identityId: rows[0].id,
    };

    ok(req, JSON.stringify(body));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export default function (req: Deno.RequestEvent, path: string) {
  if (path === `${PRE}/add`) {
    addIdentity(req);
  } else {
    notFound(req);
  }
}
