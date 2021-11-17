import {
  createdRows,
  deletedRows,
  query,
  updatedRows,
} from "../common/database.ts";
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
        RETURNING id, created_at`,
      args: [
        identityId,
        pl.name,
        pl.auth_type,
        pl.attributes,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as createdRows;
      });
    const body = {
      action: "add",
      domainId: rows[0].id,
      createdAt: rows[0].created_at,
    };

    ok(req, JSON.stringify(body));
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
        RETURNING id, now()`,
      args: [
        pl.id,
        identityId,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as deletedRows;
      });
    const body = {
      action: "del",
      domainId: rows[0].id,
      deletedAt: rows[0].deleted_at,
    };

    ok(req, JSON.stringify(body));
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
        RETURNING id, updated_at`,
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
        return rst.rows as updatedRows;
      });
    const body = {
      action: "update",
      domainId: rows[0].id,
      updatedAt: rows[0].updated_at,
    };

    ok(req, JSON.stringify(body));
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
      RETURNING id, updated_at`,
    args: [
      domainId,
      identityId,
      value,
    ],
  };
  const rows = await query(sql)
    .then((rst) => {
      return rst.rows as updatedRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function enableDomain(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const rows = await updateEnabled(pl.id, identityId, true);
    const body = {
      action: "enable",
      domainId: rows[0].id,
      updatedAt: rows[0].updated_at,
    };

    ok(req, JSON.stringify(body));
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
    const body = {
      action: "disable",
      domainId: rows[0].id,
      updatedAt: rows[0].updated_at,
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
