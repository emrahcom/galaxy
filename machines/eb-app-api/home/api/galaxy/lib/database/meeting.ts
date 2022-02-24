import { fetch } from "./common.ts";
import type { Id, Meeting, PubMeeting } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getMeeting(identityId: string, meetingId: string) {
  const sql = {
    text: `
      SELECT m.id, m.profile_id as profile_id, m.room_id as room_id,
        m.host_key, m.guest_key, m.name, m.info, m.schedule_type,
        m.schedule_attr, m.hidden, m.restricted, m.subscribable, m.enabled,
        m.created_at, m.updated_at,
        (m.enabled AND r.enabled AND d.enabled AND i.enabled) as chain_enabled
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

  return await fetch(sql) as Meeting[];
}

// -----------------------------------------------------------------------------
export async function getPublicMeeting(meetingId: string) {
  const sql = {
    text: `
      SELECT id, name, info, schedule_type, schedule_attr, restricted,
        subscribable
      FROM meeting
      WHERE id = $1
        AND hidden = false`,
    args: [
      meetingId,
    ],
  };

  return await fetch(sql) as PubMeeting[];
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
        m.schedule_attr, m.hidden, m.restricted, m.subscribable, m.enabled,
        m.created_at, m.updated_at,
        (m.enabled AND r.enabled AND d.enabled AND i.enabled) as chain_enabled
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

  return await fetch(sql) as Meeting[];
}

// -----------------------------------------------------------------------------
export async function listEnabledPublicMeeting(
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT m.id, m.name, m.info, m.schedule_type, m.schedule_attr,
        m.restricted, m.subscribable
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

  return await fetch(sql) as PubMeeting[];
}

// -----------------------------------------------------------------------------
export async function addMeeting(
  identityId: string,
  profileId: string,
  roomId: string,
  name: string,
  info: string,
  scheduleType: string,
  scheduleAttr: unknown,
  hidden: boolean,
  restricted: boolean,
  subscribable: boolean,
) {
  const sql = {
    text: `
      INSERT INTO meeting (identity_id, profile_id, room_id, name, info,
        schedule_type, schedule_attr, hidden, restricted, subscribable)
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
        $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, created_at as at`,
    args: [
      identityId,
      profileId,
      roomId,
      name,
      info,
      scheduleType,
      scheduleAttr,
      hidden,
      restricted,
      subscribable,
    ],
  };

  return await fetch(sql) as Id[];
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

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateMeeting(
  identityId: string,
  meetingId: string,
  profileId: string,
  roomId: string,
  name: string,
  info: string,
  scheduleType: string,
  scheduleAttr: unknown,
  hidden: boolean,
  restricted: boolean,
  subscribable: boolean,
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
        subscribable = $11,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      meetingId,
      profileId,
      roomId,
      name,
      info,
      scheduleType,
      scheduleAttr,
      hidden,
      restricted,
      subscribable,
    ],
  };

  return await fetch(sql) as Id[];
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

  return await fetch(sql) as Id[];
}
