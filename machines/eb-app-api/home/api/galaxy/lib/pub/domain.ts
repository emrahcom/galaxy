import { DEFAULT_LIST_SIZE, MAX_LIST_SIZE } from "../../config.ts";
import { pubDomainRows, query } from "../common/database.ts";
import { internalServerError, notFound, ok } from "../common/http-response.ts";

const PRE = "/api/pub/domain";

// -----------------------------------------------------------------------------
export async function listDomain(req: Deno.RequestEvent) {
  try {
    const pl = await req.request.json();

    let limit = pl.limit;
    if (!limit) {
      limit = DEFAULT_LIST_SIZE;
    } else if (limit > MAX_LIST_SIZE) {
      limit = MAX_LIST_SIZE;
    }

    let offset = pl.offset;
    if (!offset) offset = 0;

    const sql = {
      text: `
        SELECT id, name, enabled
        FROM domain
        WHERE public = true
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
export async function listEnabledDomain(req: Deno.RequestEvent) {
  try {
    const pl = await req.request.json();

    let limit = pl.limit;
    if (!limit) {
      limit = DEFAULT_LIST_SIZE;
    } else if (limit > MAX_LIST_SIZE) {
      limit = MAX_LIST_SIZE;
    }

    let offset = pl.offset;
    if (!offset) offset = 0;

    const sql = {
      text: `
        SELECT id, name, enabled
        FROM domain
        WHERE public = true AND enabled = true
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
  if (path === `${PRE}/list`) {
    listDomain(req);
  } else if (path === `${PRE}/list/enabled`) {
    listEnabledDomain(req);
  } else {
    notFound(req);
  }
}
