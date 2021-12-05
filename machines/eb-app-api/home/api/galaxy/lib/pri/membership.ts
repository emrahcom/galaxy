import {
  getLimit,
  getOffset,
  idRows,
  membershipRows,
  query,
} from "../common/database.ts";
import { internalServerError, notFound, ok } from "../common/http-response.ts";

const PRE = "/api/pri/membership";

// -----------------------------------------------------------------------------
export async function getMembership(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        SELECT mem.id, mem.profile_id, m.id, m.name, m.info, mem.enabled,
          mem.created_at, mem.updated_at
        FROM membership mem
          JOIN meeting m ON mem.meeting_id = m.id
        WHERE mem.id = $2
          AND mem.identity_id = $1`,
      args: [
        identityId,
        pl.id,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as membershipRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function listMembership(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const limit = getLimit(pl.limit);
    const offset = getOffset(pl.offset);

    const sql = {
      text: `
        SELECT mem.id, mem.profile_id, m.id, m.name, m.info, mem.enabled,
          mem.created_at, mem.updated_at
        FROM membership mem
          JOIN meeting m ON mem.meeting_id = m.id
        WHERE mem.identity_id = $1
        ORDER BY m.name, mem.created_at
        LIMIT $2 OFFSET $3`,
      args: [
        identityId,
        limit,
        offset,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as membershipRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function listEnabledMembership(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const limit = getLimit(pl.limit);
    const offset = getOffset(pl.offset);

    const sql = {
      text: `
        SELECT mem.id, mem.profile_id, m.id, m.name, m.info, mem.enabled,
          mem.created_at, mem.updated_at
        FROM membership mem
          JOIN meeting m ON mem.meeting_id = m.id
        WHERE mem.identity_id = $1
          AND mem.enabled = true
          AND m.enabled = true
        ORDER BY m.name, mem.created_at
        LIMIT $2 OFFSET $3`,
      args: [
        identityId,
        limit,
        offset,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as membershipRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function delMembership(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();

    // membership owner or meeting owner can delete the record
    const sql = {
      text: `
        DELETE FROM membership mem
        WHERE id = $2
          AND (identity_id = $1
               OR exists(SELECT 1
                         FROM meeting m
                         WHERE m.id = mem.meeting_id
                           AND m.identity_id = $1))
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
export async function updateMembership(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();

    // meeting_id cannot be updated
    const sql = {
      text: `
        UPDATE membership
        SET
          profile_id= (SELECT id
                       FROM profile
                       WHERE id = $3
                         AND identity_id = $1),
          updated_at = now()
        WHERE id = $2
          AND identity_id = $1
        RETURNING id, updated_at as at`,
      args: [
        identityId,
        pl.id,
        pl.profile_id,
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
export default function (
  req: Deno.RequestEvent,
  path: string,
  identityId: string,
) {
  if (path === `${PRE}/get`) {
    getMembership(req, identityId);
  } else if (path === `${PRE}/list`) {
    listMembership(req, identityId);
  } else if (path === `${PRE}/list/enabled`) {
    listEnabledMembership(req, identityId);
  } else if (path === `${PRE}/del`) {
    delMembership(req, identityId);
  } else if (path === `${PRE}/update`) {
    updateMembership(req, identityId);
  } else {
    notFound(req);
  }
}
