import {
  getLimit,
  getOffset,
  idRows,
  inviteRows,
  query,
} from "../common/database.ts";
import { internalServerError, notFound, ok } from "../common/http-response.ts";

const PRE = "/api/pri/invite";

// -----------------------------------------------------------------------------
export async function getInvite(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        SELECT i.id, m.id as meeting_id, m.name as meeting_name,
          m.info as meeting_info, i.code, i.as_host, i.enabled, i.created_at,
          i.updated_at, i.expired_at
        FROM invite i
          JOIN meeting m ON i.meeting_id = m.id
        WHERE i.id = $2
          AND i.identity_id = $1
          AND i.expired_at > now()`,
      args: [
        identityId,
        pl.id,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as inviteRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function listInvite(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const limit = getLimit(pl.limit);
    const offset = getOffset(pl.offset);

    const sql = {
      text: `
        SELECT i.id, m.id as meeting_id, m.name as meeting_name,
          m.info as meeting_info, i.code, i.as_host, i.enabled, i.created_at,
          i.updated_at, i.expired_at
        FROM invite i
          JOIN meeting m ON i.meeting_id = m.id
        WHERE i.identity_id = $1
          AND i.expired_at > now()
        ORDER BY m.name, i.created_at
        LIMIT $2 OFFSET $3`,
      args: [
        identityId,
        limit,
        offset,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as inviteRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function addInvite(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        INSERT INTO invite (identity_id, meeting_id, as_host)
        VALUES (
          $1,
          (SELECT id
           FROM meeting
           WHERE id = $2
             AND identity_id = $1),
          $3)
        RETURNING id, created_at as at`,
      args: [
        identityId,
        pl.meeting_id,
        pl.as_host,
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
export async function delInvite(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        DELETE FROM invite
        WHERE id = $2
          AND identity_id = $1
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
export async function updateEnabled(
  identityId: string,
  inviteId: string,
  value = true,
) {
  const sql = {
    text: `
      UPDATE invite
      SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      inviteId,
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
export async function enableInvite(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const rows = await updateEnabled(identityId, pl.id, true);

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function disableInvite(
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
    getInvite(req, identityId);
  } else if (path === `${PRE}/list`) {
    listInvite(req, identityId);
  } else if (path === `${PRE}/add`) {
    addInvite(req, identityId);
  } else if (path === `${PRE}/del`) {
    delInvite(req, identityId);
  } else if (path === `${PRE}/enable`) {
    enableInvite(req, identityId);
  } else if (path === `${PRE}/disable`) {
    disableInvite(req, identityId);
  } else {
    notFound(req);
  }
}
