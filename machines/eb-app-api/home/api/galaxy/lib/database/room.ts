import { idRows, query } from "./common.ts";

// -----------------------------------------------------------------------------
interface roomRows {
  [index: number]: {
    id: string;
    name: string;
    domain_id: string;
    domain_name: string;
    has_suffix: boolean;
    suffix: string;
    enabled: boolean;
    chain_enabled: boolean;
    created_at: string;
    updated_at: string;
    accessed_at: string;
  };
}

// -----------------------------------------------------------------------------
export async function getRoom(identityId: string, roomId: string) {
  const sql = {
    text: `
      SELECT r.id, r.name, d.id as domain_id, d.name as domain_name,
        r.has_suffix, r.suffix, r.enabled, r.created_at, r.updated_at,
        r.accessed_at, (r.enabled AND d.enabled AND i.enabled) as
        chain_enabled
      FROM room r
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i ON d.identity_id = i.id
      WHERE r.id = $2
        AND r.identity_id = $1
        AND r.ephemeral = false`,
    args: [
      identityId,
      roomId,
    ],
  };

  const rows = await query(sql)
    .then((rst) => {
      return rst.rows as roomRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function listRoom(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT r.id, r.name, d.id as domain_id, d.name as domain_name,
        r.has_suffix, r.suffix, r.enabled, r.created_at, r.updated_at,
        r.accessed_at, (r.enabled AND d.enabled AND i.enabled) as
        chain_enabled
      FROM room r
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i ON d.identity_id = i.id
      WHERE r.identity_id = $1
        AND r.ephemeral = false
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
      return rst.rows as roomRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function addRoom(
  identityId: string,
  domainId: string,
  name: string,
  hasSuffix: boolean,
) {
  const sql = {
    text: `
      INSERT INTO room (identity_id, domain_id, name, has_suffix, ephemeral)
      VALUES (
        $1,
        (SELECT id
         FROM domain
         WHERE id = $2
           AND (identity_id = $1
                OR public = true)),
        $3, $4, false)
      RETURNING id, created_at as at`,
    args: [
      identityId,
      domainId,
      name,
      hasSuffix,
    ],
  };

  const rows = await query(sql)
    .then((rst) => {
      return rst.rows as idRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function delRoom(identityId: string, roomId: string) {
  const sql = {
    text: `
      DELETE FROM room
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      roomId,
    ],
  };

  const rows = await query(sql)
    .then((rst) => {
      return rst.rows as idRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function updateRoom(
  identityId: string,
  roomId: string,
  domainId: string,
  name: string,
  hasSuffix: boolean,
) {
  const sql = {
    text: `
      UPDATE room
      SET
        domain_id = (SELECT id
                     FROM domain
                     WHERE id = $3
                       AND (identity_id = $1
                            OR public = true)),
        name = $4,
        has_suffix = $5,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      roomId,
      domainId,
      name,
      hasSuffix,
    ],
  };

  const rows = await query(sql)
    .then((rst) => {
      return rst.rows as idRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function updateEnabled(
  identityId: string,
  roomId: string,
  value = true,
) {
  const sql = {
    text: `
      UPDATE room
      SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
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
