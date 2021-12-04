import {
  getLimit,
  getOffset,
  idRows,
  meetingRows,
  query,
} from "../common/database.ts";
import { internalServerError, notFound, ok } from "../common/http-response.ts";

const PRE = "/api/pri/meeting";

// -----------------------------------------------------------------------------
export async function getMeeting(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        SELECT id, profile_id, room_id, name, info, schedule_type,
          schedule_attr, hidden, restricted, enabled, created_at, updated_at
        FROM meeting
        WHERE id = $2
          AND identity_id = $1`,
      args: [
        identityId,
        pl.id,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as meetingRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function listMeeting(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const limit = getLimit(pl.limit);
    const offset = getOffset(pl.offset);

    const sql = {
      text: `
        SELECT id, profile_id, room_id, name, info, schedule_type,
          schedule_attr, hidden, restricted, enabled, created_at, updated_at
        FROM meeting
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
        return rst.rows as meetingRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function listEnabledMeeting(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const limit = getLimit(pl.limit);
    const offset = getOffset(pl.offset);

    const sql = {
      text: `
        SELECT id, profile_id, room_id, name, info, schedule_type,
          schedule_attr, hidden, restricted, enabled, created_at, updated_at
        FROM meeting
        WHERE identity_id = $1
          AND enabled = true
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
        return rst.rows as meetingRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function addMeeting(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        INSERT INTO meeting (identity_id, profile_id, room_id, name, info,
          schedule_type, schedule_attr, hidden, restricted)
        VALUES (
          $1,
          (SELECT id
           FROM profile
           WHERE id = $2
             AND identity_id = $1),
          (SELECT id
           FROM room
           WHERE id = $3
             AND identity_id = $1),
          $4, $5, $6, $7, $8, $9)
        RETURNING id, created_at as at`,
      args: [
        identityId,
        pl.profile_id,
        pl.room_id,
        pl.name,
        pl.info,
        pl.schedule_type,
        pl.schedule_attr,
        pl.hidden,
        pl.restricted,
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
export async function delMeeting(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        DELETE FROM meeting
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
export async function updateMeeting(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        UPDATE meeting
        SET
          profile_id= (SELECT id
                       FROM profile
                       WHERE id = $3
                         AND identity_id = $1),
          room_id = (SELECT id
                     FROM room
                     WHERE id = $4
                       AND identity_id = $1),
          name = $5,
          info = $6,
          schedule_type = $7,
          schedule_attr = $8,
          hidden = $9,
          restricted = $10,
          updated_at = now()
        WHERE id = $2
          AND identity_id = $1
        RETURNING id, updated_at as at`,
      args: [
        identityId,
        pl.id,
        pl.profile_id,
        pl.room_id,
        pl.name,
        pl.info,
        pl.schedule_type,
        pl.schedule_attr,
        pl.hidden,
        pl.restricted,
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
  meetingId: string,
  value = true,
) {
  const sql = {
    text: `
      UPDATE meeting
      SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      meetingId,
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
export async function enableMeeting(
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
export async function disableMeeting(
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
    getMeeting(req, identityId);
  } else if (path === `${PRE}/list`) {
    listMeeting(req, identityId);
  } else if (path === `${PRE}/list/enabled`) {
    listEnabledMeeting(req, identityId);
  } else if (path === `${PRE}/add`) {
    addMeeting(req, identityId);
  } else if (path === `${PRE}/del`) {
    delMeeting(req, identityId);
  } else if (path === `${PRE}/update`) {
    updateMeeting(req, identityId);
  } else if (path === `${PRE}/enable`) {
    enableMeeting(req, identityId);
  } else if (path === `${PRE}/disable`) {
    disableMeeting(req, identityId);
  } else {
    notFound(req);
  }
}
