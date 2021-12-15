import { idRows, query } from "../common/database.ts";

// -----------------------------------------------------------------------------
export interface meetingRows {
  [index: number]: {
    id: string;
    profile_id: string;
    room_id: string;
    host_key: string;
    guest_key: string;
    name: string;
    info: string;
    schedule_type: string;
    schedule_attr: unknown;
    hidden: boolean;
    restricted: boolean;
    enabled: boolean;
    chain_enabled: boolean;
    created_at: string;
    updated_at: string;
  };
}

// -----------------------------------------------------------------------------
export interface pubMeetingRows {
  [index: number]: {
    id: string;
    name: string;
    info: string;
    schedule_type: string;
    schedule_attr: unknown;
    restricted: boolean;
  };
}

// -----------------------------------------------------------------------------
export async function getMeeting(identityId: string, meetingId: string) {
  const sql = {
    text: `
      SELECT m.id, m.profile_id as profile_id, m.room_id as room_id,
        m.host_key, m.guest_key, m.name, m.info, m.schedule_type,
        m.schedule_attr, m.hidden, m.restricted, m.enabled, m.created_at,
        m.updated_at, (m.enabled AND r.enabled AND d.enabled AND i.enabled) as
        chain_enabled
      FROM meeting m
        JOIN room r ON m.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i ON d.identity_id = i.id
      WHERE m.id = $2
        AND m.identity_id = $1`,
    args: [
      identityId,
      meetingId,
    ],
  };

  const rows = await query(sql)
    .then((rst) => {
      return rst.rows as meetingRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function getPublicMeeting(meetingId: string) {
  const sql = {
    text: `
    SELECT id, name, info, schedule_type, schedule_attr, restricted
    FROM meeting
    WHERE id = $1
      AND hidden = false`,
    args: [
      meetingId,
    ],
  };

  const rows = await query(sql)
    .then((rst) => {
      return rst.rows as pubMeetingRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function listMeeting(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT m.id, m.profile_id as profile_id, m.room_id as room_id,
        m.host_key, m.guest_key, m.name, m.info, m.schedule_type,
        m.schedule_attr, m.hidden, m.restricted, m.enabled, m.created_at,
        m.updated_at, (m.enabled AND r.enabled AND d.enabled AND i.enabled) as
        chain_enabled
      FROM meeting m
        JOIN room r ON m.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i ON d.identity_id = i.id
      WHERE m.identity_id = $1
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

  return rows;
}

// -----------------------------------------------------------------------------
export async function listEnabledPublicMeeting(
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT m.id, m.name, m.info, m.schedule_type, m.schedule_attr,
        m.restricted
      FROM meeting m
        JOIN identity i ON m.identity_id = i.id
        JOIN room r ON m.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i2 ON d.identity_id = i2.id
      WHERE m.hidden = false
        AND m.enabled = true
        AND i.enabled = true
        AND r.enabled = true
        AND d.enabled = true
        AND i2.enabled = true
      ORDER BY m.created_at DESC
      LIMIT $1 OFFSET $2`,
    args: [
      limit,
      offset,
    ],
  };

  const rows = await query(sql)
    .then((rst) => {
      return rst.rows as pubMeetingRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function addMeeting(
  identityId: string,
  meetingProfileId: string,
  meetingRoomId: string,
  meetingName: string,
  meetingInfo: string,
  meetingScheduleType: string,
  meetingScheduleAttr: unknown,
  meetingHidden: boolean,
  meetingRestricted: boolean,
) {
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
      meetingProfileId,
      meetingRoomId,
      meetingName,
      meetingInfo,
      meetingScheduleType,
      meetingScheduleAttr,
      meetingHidden,
      meetingRestricted,
    ],
  };

  const rows = await query(sql)
    .then((rst) => {
      return rst.rows as idRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function delMeeting(identityId: string, meetingId: string) {
  const sql = {
    text: `
      DELETE FROM meeting
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      meetingId,
    ],
  };

  const rows = await query(sql)
    .then((rst) => {
      return rst.rows as idRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function updateMeeting(
  identityId: string,
  meetingId: string,
  meetingProfileId: string,
  meetingRoomId: string,
  meetingName: string,
  meetingInfo: string,
  meetingScheduleType: string,
  meetingScheduleAttr: unknown,
  meetingHidden: boolean,
  meetingRestricted: boolean,
) {
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
      meetingId,
      meetingProfileId,
      meetingRoomId,
      meetingName,
      meetingInfo,
      meetingScheduleType,
      meetingScheduleAttr,
      meetingHidden,
      meetingRestricted,
    ],
  };

  const rows = await query(sql)
    .then((rst) => {
      return rst.rows as idRows;
    });

  return rows;
}

// -----------------------------------------------------------------------------
export async function updateMeetingEnabled(
  identityId: string,
  meetingId: string,
  value: boolean,
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
