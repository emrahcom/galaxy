import { idRows, query } from "../common/database.ts";
import { internalServerError, notFound, ok } from "../common/http-response.ts";

const PRE = "/api/adm/identity";

// -----------------------------------------------------------------------------
export async function addIdentity(req: Deno.RequestEvent) {
  try {
    const pl = await req.request.json();
    const identityId = pl.identity_id;
    const identityEmail = pl.identity_email;

    const sql = {
      text: `
        INSERT INTO identity (id)
        VALUES ($1)
        RETURNING id, created_at as at`,
      args: [
        identityId,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as idRows;
      });

    // add the initial profile using email if the previous action is successful
    const sql1 = {
      text: `
        INSERT INTO profile (identity_id, name, email, is_default)
        VALUES ($1, $2, $3, true)`,
      args: [
        identityId,
        identityEmail.split("@")[0],
        identityEmail,
      ],
    };
    if (rows[0] !== undefined) await query(sql1);

    ok(req, JSON.stringify(rows));
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
