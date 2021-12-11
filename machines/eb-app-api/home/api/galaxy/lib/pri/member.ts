import {
  getLimit,
  getOffset,
  idRows,
  memberRows,
  query,
} from "../common/database.ts";
import { internalServerError, notFound, ok } from "../common/http-response.ts";

const PRE = "/api/pri/member";

// -----------------------------------------------------------------------------
export async function getMember(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        SELECT mem.id, p.name as profile_name, mem.is_host, mem.enabled,
          mem.created_at, mem.updated_at
        FROM membership mem
          JOIN profile p ON mem.profile_id = p.id
        WHERE mem.id = $2
          AND EXISTS (SELECT 1
                      FROM meeting m
                      WHERE m.id = mem.meeting_id
                        AND m.identity_id = $1)`,
      args: [
        identityId,
        pl.id,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as memberRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function listMember(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const limit = getLimit(pl.limit);
    const offset = getOffset(pl.offset);

    const sql = {
      text: `
        SELECT mem.id, p.name as profile_name, mem.is_host, mem.enabled,
          mem.created_at, mem.updated_at
        FROM membership mem
          JOIN profile p ON mem.profile_id = p.id
        WHERE mem.meeting_id = $2
          AND EXISTS (SELECT 1
                      FROM meeting m
                      WHERE m.id = mem.meeting_id
                        AND m.identity_id = $1)
        ORDER BY profile_name, mem.created_at
        LIMIT $3 OFFSET $4`,
      args: [
        identityId,
        pl.meeting_id,
        limit,
        offset,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as memberRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function delMember(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();

    const sql = {
      text: `
        DELETE FROM membership mem
        WHERE id = $2
          AND EXISTS (SELECT 1
                      FROM meeting m
                      WHERE m.id = mem.meeting_id
                        AND m.identity_id = $1)
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
  membershipId: string,
  value = true,
) {
  const sql = {
    text: `
      UPDATE membership mem
      SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting m
                    WHERE m.id = mem.meeting_id
                      AND m.identity_id = $1)
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      membershipId,
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
export async function enableMember(
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
export async function disableMember(
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
export async function updateIsHost(
  identityId: string,
  membershipId: string,
  value = true,
) {
  const sql = {
    text: `
      UPDATE membership mem
      SET
        is_host = $3,
        updated_at = now()
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting m
                    WHERE m.id = mem.meeting_id
                      AND m.identity_id = $1)
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      membershipId,
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
export async function setHostMember(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const rows = await updateIsHost(identityId, pl.id, true);

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function setGuestMember(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const rows = await updateIsHost(identityId, pl.id, false);

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
    getMember(req, identityId);
  } else if (path === `${PRE}/list`) {
    listMember(req, identityId);
  } else if (path === `${PRE}/del`) {
    delMember(req, identityId);
  } else if (path === `${PRE}/enable`) {
    enableMember(req, identityId);
  } else if (path === `${PRE}/disable`) {
    disableMember(req, identityId);
  } else if (path === `${PRE}/set/host`) {
    setHostMember(req, identityId);
  } else if (path === `${PRE}/set/guest`) {
    setGuestMember(req, identityId);
  } else {
    notFound(req);
  }
}
