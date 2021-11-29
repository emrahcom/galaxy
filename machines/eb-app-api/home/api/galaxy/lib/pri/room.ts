import {
  getLimit,
  getOffset,
  idRows,
  query,
  roomRows,
} from "../common/database.ts";
import { internalServerError, notFound, ok } from "../common/http-response.ts";

const PRE = "/api/pri/room";

// -----------------------------------------------------------------------------
export async function getRoom(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        SELECT r.id, r.name, d.id as domain_id, d.name as domain_name,
            r.has_suffix, r.suffix, r.enabled, r.created_at, r.updated_at,
            r.accessed_at
        FROM room AS r JOIN domain AS d ON r.domain_id = d.id
        WHERE r.id = $2 AND r.identity_id = $1 AND r.ephemeral = false`,
      args: [
        identityId,
        pl.id,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as roomRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function listRoom(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const limit = getLimit(pl.limit);
    const offset = getOffset(pl.offset);

    const sql = {
      text: `
        SELECT r.id, r.name, d.id as domain_id, d.name as domain_name,
            r.has_suffix, r.suffix, r.enabled, r.created_at, r.updated_at,
            r.accessed_at
        FROM room AS r JOIN domain AS d ON r.domain_id = d.id
        WHERE r.identity_id = $1 AND r.ephemeral = false
        ORDER BY r.name
        LIMIT $2 OFFSET $3`,
      args: [
        identityId,
        limit,
        offset,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as roomRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function listEnabledRoom(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const limit = getLimit(pl.limit);
    const offset = getOffset(pl.offset);

    const sql = {
      text: `
        SELECT r.id, r.name, d.id as domain_id, d.name as domain_name,
            r.has_suffix, r.suffix, r.enabled, r.created_at, r.updated_at,
            r.accessed_at
        FROM room AS r JOIN domain AS d ON r.domain_id = d.id
        WHERE r.identity_id = $1 AND r.ephemeral = false AND r.enabled = true
            AND d.enabled = true
        ORDER BY r.name
        LIMIT $2 OFFSET $3`,
      args: [
        identityId,
        limit,
        offset,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as roomRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function addRoom(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        INSERT INTO room (identity_id, domain_id, name, has_suffix)
        VALUES ($1,
                (SELECT id
                 FROM domain
                 WHERE id = $2 AND (identity_id = $1 OR public = true)),
                $3, $4)
        RETURNING id, created_at as at`,
      args: [
        identityId,
        pl.domain_id,
        pl.name,
        pl.has_suffix,
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
export async function delRoom(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        DELETE FROM room
        WHERE id = $2 AND identity_id = $1
        RETURNING id, now() as at`,
      args: [
        identityId,
        pl.id,
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
export async function updateRoom(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        UPDATE room SET
          domain_id = (SELECT id
                       FROM domain
                       WHERE id = $3 AND (identity_id = $1 or public = true)),
          name = $4,
          has_suffix = $5,
          updated_at = now()
        WHERE id = $2 AND identity_id = $1
        RETURNING id, updated_at as at`,
      args: [
        identityId,
        pl.id,
        pl.domain_id,
        pl.name,
        pl.has_suffix,
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
  identityId: string,
  roomId: string,
  value = true,
) {
  const sql = {
    text: `
      UPDATE room SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2 AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      roomId,
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
export async function enableRoom(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const rows = await updateEnabled(identityId, pl.id, true);

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function disableRoom(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const rows = await updateEnabled(identityId, pl.id, false);

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
    getRoom(req, identityId);
  } else if (path === `${PRE}/list`) {
    listRoom(req, identityId);
  } else if (path === `${PRE}/list/enabled`) {
    listEnabledRoom(req, identityId);
  } else if (path === `${PRE}/add`) {
    addRoom(req, identityId);
  } else if (path === `${PRE}/del`) {
    delRoom(req, identityId);
  } else if (path === `${PRE}/update`) {
    updateRoom(req, identityId);
  } else if (path === `${PRE}/enable`) {
    enableRoom(req, identityId);
  } else if (path === `${PRE}/disable`) {
    disableRoom(req, identityId);
  } else {
    notFound(req);
  }
}
