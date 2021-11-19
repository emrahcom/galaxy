import { DEFAULT_LIST_SIZE, MAX_LIST_SIZE } from "../../config.ts";
import { domainRows, idRows, query } from "../common/database.ts";
import { internalServerError, notFound, ok } from "../common/http-response.ts";

const PRE = "/api/pri/domain";

// -----------------------------------------------------------------------------
export async function getDomain(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        SELECT id, name, auth_type, attributes, enabled, created_at, updated_at
        FROM domain
        WHERE id = $1 and identity_id = $2`,
      args: [
        pl.id,
        identityId,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as domainRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function listDomain(req: Deno.RequestEvent, identityId: string) {
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
        SELECT id, name, auth_type, attributes, enabled, created_at, updated_at
        FROM domain
        WHERE identity_id = $1
        ORDER BY name
        LIMIT $2 OFFSET $3`,
      args: [
        identityId,
        limit,
        offset,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as domainRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function addDomain(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        INSERT INTO domain (identity_id, name, auth_type, attributes)
        VALUES ($1, $2, $3, $4::jsonb)
        RETURNING id, created_at as at`,
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

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function delDomain(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        DELETE FROM domain
        WHERE id = $1 and identity_id = $2
        RETURNING id, now() as at`,
      args: [
        pl.id,
        identityId,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as idRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function updateDomain(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        UPDATE domain SET
          name = $3,
          auth_type = $4,
          attributes = $5::jsonb,
          enabled = $6,
          updated_at = now()
        WHERE id = $1 and identity_id = $2
        RETURNING id, updated_at as at`,
      args: [
        pl.id,
        identityId,
        pl.name,
        pl.auth_type,
        pl.attributes,
        pl.enabled,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as idRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function updateEnabled(
  domainId: string,
  identityId: string,
  value = true,
) {
  const sql = {
    text: `
      UPDATE domain SET
        enabled = $3,
        updated_at = now()
      WHERE id = $1 and identity_id = $2
      RETURNING id, updated_at as at`,
    args: [
      domainId,
      identityId,
      value,
    ],
  };
  const rows = await query(sql)
    .then((rst) => {
      return rst.rows as idRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function enableDomain(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const rows = await updateEnabled(pl.id, identityId, true);

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function disableDomain(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const rows = await updateEnabled(pl.id, identityId, false);

    ok(req, JSON.stringify(rows));
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
  if (path === `${PRE}/get`) {
    getDomain(req, identityId);
  } else if (path === `${PRE}/list`) {
    listDomain(req, identityId);
  } else if (path === `${PRE}/add`) {
    addDomain(req, identityId);
  } else if (path === `${PRE}/del`) {
    delDomain(req, identityId);
  } else if (path === `${PRE}/update`) {
    updateDomain(req, identityId);
  } else if (path === `${PRE}/enable`) {
    enableDomain(req, identityId);
  } else if (path === `${PRE}/disable`) {
    disableDomain(req, identityId);
  } else {
    notFound(req);
  }
}
