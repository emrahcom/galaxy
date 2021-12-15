import { getLimit, getOffset, idRows, profileRows, query } from "database.ts";

// -----------------------------------------------------------------------------
export async function getProfile(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        SELECT id, name, email, is_default, created_at, updated_at
        FROM profile
        WHERE id = $2
          AND identity_id = $1`,
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
        SELECT id, name, email, is_default, created_at, updated_at
        FROM profile
        WHERE identity_id = $1
          AND is_default = true
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
        SELECT id, name, email, is_default, created_at, updated_at
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
export async function addProfile(
  identityId: string,
  identityName: string,
  identityEmail: string,
) {
  const sql = {
    text: `
      INSERT INTO profile (identity_id, name, email)
      VALUES ($1, $2, $3)
      RETURNING id, created_at as at`,
    args: [
      identityId,
      identityName,
      identityEmail,
    ],
  };
  const rows = await query(sql)
    .then((rst) => {
      return rst.rows as idRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function delProfile(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const sql = {
      text: `
        DELETE FROM profile
        WHERE id = $2
          AND identity_id = $1
          AND is_default = false
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
        UPDATE profile
        SET
          name = $3,
          email = $4,
          updated_at = now()
        WHERE id = $2
          AND identity_id = $1
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
export async function setDefaultProfile(
  req: Deno.RequestEvent,
  identityId: string,
) {
  try {
    const pl = await req.request.json();

    // note: don't add an is_default checking into WHERE. user should set a
    // profile as default although it's already default to solve the duplicated
    // defaults issue. Also UI should support this.
    const sql = {
      text: `
        UPDATE profile
        SET
          is_default = true,
          updated_at = now()
        WHERE id = $2
          AND identity_id = $1
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

    // reset the old default if the set action is successful
    const sql1 = {
      text: `
        UPDATE profile
        SET
          is_default = false,
          updated_at = now()
        WHERE identity_id = $1
          AND id != $2
          AND is_default = true`,
      args: [
        identityId,
        pl.id,
      ],
    };
    if (rows[0] !== undefined) await query(sql1);

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}
