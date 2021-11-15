import { query } from "../common/database.ts";
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
        VALUES ($1)`,
      args: [
        identityId,
      ],
    };
    const id = await query(sql)
      .then((rst) => {
        return rst.rows[0].id;
      });
    const body = {
      identityId: `${id}`,
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
