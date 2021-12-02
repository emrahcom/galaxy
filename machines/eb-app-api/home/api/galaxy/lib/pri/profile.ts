import {
  getLimit,
  getOffset,
  idRows,
  profileRows,
  query,
} from "../common/database.ts";
import { internalServerError, notFound, ok } from "../common/http-response.ts";

const PRE = "/api/pri/profile";

// -----------------------------------------------------------------------------
export async function getProfile(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        SELECT id, name, email, default, enabled, created_at, updated_at
        FROM profile
        WHERE id = $2 AND identity_id = $1`,
      args: [
        identityId,
        pl.id,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as profileRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function getDefaultProfile(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const sql = {
      text: `
        SELECT id, name, email, default, enabled, created_at, updated_at
        FROM profile
        WHERE identity_id = $1 AND default = true
        LIMIT 1`,
      args: [
        identityId,
      ],
    };
    const rows = await query(sql)
      .then((rst) => {
        return rst.rows as profileRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function listProfile(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const limit = getLimit(pl.limit);
    const offset = getOffset(pl.offset);

    const sql = {
      text: `
        SELECT id, name, email, default, enabled, created_at, updated_at
        FROM profile
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
        return rst.rows as profileRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function listEnabledProfile(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const limit = getLimit(pl.limit);
    const offset = getOffset(pl.offset);

    const sql = {
      text: `
        SELECT id, name, email, default, enabled, created_at, updated_at
        FROM profile
        WHERE identity_id = $1 AND enabled = true
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
        return rst.rows as profileRows;
      });

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export async function addProfile(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        INSERT INTO profile (identity_id, name, email)
        VALUES ($1, $2, $3)
        RETURNING id, created_at as at`,
      args: [
        identityId,
        pl.name,
        pl.email,
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
export async function delProfile(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        DELETE FROM profile
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
export async function updateProfile(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        UPDATE profile SET
          name = $3,
          email = $4,
          updated_at = now()
        WHERE id = $2 AND identity_id = $1
        RETURNING id, updated_at as at`,
      args: [
        identityId,
        pl.id,
        pl.name,
        pl.email,
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
  profileId: string,
  value = true,
) {
  const sql = {
    text: `
      UPDATE profile SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2 AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      profileId,
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
export async function enableProfile(
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
export async function disableProfile(
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
export async function setDefaultProfile(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        UPDATE profile SET
          default = true,
          updated_at = now()
        WHERE id = $2 AND identity_id = $1
        RETURNING id, updated_at as at`,
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
export default function (
  req: Deno.RequestEvent,
  path: string,
  identityId: string,
) {
  if (path === `${PRE}/get`) {
    getProfile(req, identityId);
  } else if (path === `${PRE}/get/default`) {
    getDefaultProfile(req, identityId);
  } else if (path === `${PRE}/list`) {
    listProfile(req, identityId);
  } else if (path === `${PRE}/list/enabled`) {
    listEnabledProfile(req, identityId);
  } else if (path === `${PRE}/add`) {
    addProfile(req, identityId);
  } else if (path === `${PRE}/del`) {
    delProfile(req, identityId);
  } else if (path === `${PRE}/update`) {
    updateProfile(req, identityId);
  } else if (path === `${PRE}/enable`) {
    enableProfile(req, identityId);
  } else if (path === `${PRE}/disable`) {
    disableProfile(req, identityId);
  } else if (path === `${PRE}/set/default`) {
    setDefaultProfile(req, identityId);
  } else {
    notFound(req);
  }
}
