import {
  getLimit,
  getOffset,
  pubDomainRows,
  query,
} from "../common/database.ts";
import { internalServerError, notFound, ok } from "../common/http-response.ts";

const PRE = "/api/pub/domain";

// -----------------------------------------------------------------------------
export async function listEnabledDomain(req: Deno.RequestEvent) {
  try {
    const pl = await req.request.json();
    const limit = getLimit(pl.limit);
    const offset = getOffset(pl.offset);

    const sql = {
      text: `
        SELECT d.id, d.name, d.enabled
        FROM domain d
          JOIN identity i ON d.identity_id = i.id
        WHERE d.public = true
          AND d.enabled = true
          AND i.enabled = true
        ORDER BY name
        LIMIT $1 OFFSET $2`,
      args: [
        limit,
        offset,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as pubDomainRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export default function (req: Deno.RequestEvent, path: string) {
  if (path === `${PRE}/list/enabled`) {
    listEnabledDomain(req);
  } else {
    notFound(req);
  }
}
