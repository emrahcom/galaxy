import { idRows, query } from "./common.ts";

// -----------------------------------------------------------------------------
interface memberRows {
  [index: number]: {
    id: string;
    profile_name: string;
    is_host: boolean;
    enabled: boolean;
    created_at: string;
    updated_at: string;
  };
}

// -----------------------------------------------------------------------------
export async function getMember(identityId: string, membershipId: string) {
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
      membershipId,
    ],
  };

  const rows = await query(sql)
    .then((rst) => {
      return rst.rows as memberRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function listMember(
  identityId: string,
  meetingId: string,
  limit: number,
  offset: number,
) {
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
      meetingId,
      limit,
      offset,
    ],
  };

  const rows = await query(sql)
    .then((rst) => {
      return rst.rows as memberRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function delMember(identityId: string, membershipId: string) {
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
      membershipId,
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
  membershipId: string,
  value: boolean,
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
export async function updateIsHost(
  identityId: string,
  membershipId: string,
  value: boolean,
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
