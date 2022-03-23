import { fetch } from "./common.ts";
import type {
  Id,
  Meeting,
  MeetingLinkSet,
  MeetingPublic,
  MeetingReduced,
} from "./types.ts";

// -----------------------------------------------------------------------------
export async function getMeeting(identityId: string, meetingId: string) {
  const sql = {
    text: `
      SELECT m.id, m.name, m.info, p.id as profile_id, p.name as profile_name,
        p.email as profile_email,
        (CASE m.schedule_type
         WHEN 'ephemeral' THEN d.id
         END
        ) as domain_id,
        d.name as domain_name, d.domain_attr->>'url' as domain_url,
        d.enabled as domain_enabled, r.id as room_id, r.name as room_name,
        r.enabled as room_enabled, m.host_key, m.guest_key, m.schedule_type,
        m.hidden, m.restricted, m.subscribable, m.enabled, m.created_at,
        m.updated_at
      FROM meeting m
        JOIN room r ON m.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        LEFT JOIN profile p ON m.profile_id = p.id
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
      SELECT id, name, info, schedule_type, restricted, subscribable
      FROM meeting
      WHERE id = $1
        AND hidden = false`,
    args: [
      meetingId,
    ],
  };

  return await fetch(sql) as MeetingPublic[];
}

// -----------------------------------------------------------------------------
export async function getMeetingLinkSet(identityId: string, meetingId: string) {
  await updateMeetingRoomSuffix(meetingId);
  await updateMeetingRoomAccessTime(meetingId);

  const sql = {
    text: `
      SELECT m.name, r.name as room_name, r.has_suffix, r.suffix, d.auth_type,
        d.domain_attr, p.name as profile_name, p.email as profile_email
      FROM meeting m
        JOIN room r ON m.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        LEFT JOIN profile p ON m.profile_id = p.id
      WHERE m.id = $2
        AND m.identity_id = $1`,
    args: [
      identityId,
      meetingId,
    ],
  };

  return await fetch(sql) as MeetingLinkSet[];
}

// -----------------------------------------------------------------------------
export async function listMeeting(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT m.id, m.name, m.info, d.name as domain_name,
        d.domain_attr->>'url' as domain_url, r.name as room_name,
        m.schedule_type,
        (CASE m.schedule_type
         WHEN 'scheduled' THEN (SELECT min(started_at)
                                FROM meeting_schedule
                                WHERE meeting_id = m.id
                                  AND started_at > now()
                               )
         END
        ) as scheduled_at,
        m.hidden, m.restricted, m.subscribable, m.enabled,
        (r.enabled AND i2.enabled
         AND d.enabled AND i1.enabled
         AND CASE r.identity_id
             WHEN $1 THEN true
             ELSE (SELECT enabled
                   FROM room_partner
                   WHERE identity_id = $1
                     AND room_id = r.id
                  )
             END
         AND CASE d.identity_id
             WHEN r.identity_id THEN true
             ELSE CASE d.public
                  WHEN true THEN true
                  ELSE (SELECT enabled
                        FROM domain_partner
                        WHERE identity_id = r.identity_id
                          AND domain_id = d.id
                       )
                  END
             END
        ) as chain_enabled, m.updated_at, 'private' as ownership
      FROM meeting m
        JOIN room r ON m.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i1 ON d.identity_id = i1.id
        JOIN identity i2 ON r.identity_id = i2.id
      WHERE m.identity_id = $1
        AND (m.schedule_type != 'ephemeral'
             OR r.accessed_at + interval '4 hours' > now()
            )

      UNION

      SELECT m.id, m.name, m.info, '' as domain_name, '' as domain_url,
        '' as room_name, m.schedule_type,
        (CASE m.schedule_type
         WHEN 'scheduled' THEN (SELECT min(started_at)
                                FROM meeting_schedule
                                WHERE meeting_id = m.id
                                  AND started_at > now()
                               )
         END
        ) as scheduled_at,
        m.hidden, m.restricted, m.subscribable, m.enabled,
        (mem.enabled AND i3.enabled
         AND r.enabled AND i2.enabled
         AND d.enabled AND i1.enabled
         AND CASE r.identity_id
             WHEN m.identity_id THEN true
             ELSE (SELECT enabled
                   FROM room_partner
                   WHERE identity_id = m.identity_id
                     AND room_id = r.id
                  )
             END
         AND CASE d.identity_id
             WHEN r.identity_id THEN true
             ELSE CASE d.public
                  WHEN true THEN true
                  ELSE (SELECT enabled
                        FROM domain_partner
                        WHERE identity_id = r.identity_id
                          AND domain_id = d.id
                       )
                  END
             END
        ) as chain_enabled, m.updated_at, 'member' as ownership
      FROM meeting_member mem
        JOIN meeting m ON mem.meeting_id = m.id
        JOIN room r ON m.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i1 ON d.identity_id = i1.id
        JOIN identity i2 ON r.identity_id = i2.id
        JOIN identity i3 ON m.identity_id = i3.id
      WHERE mem.identity_id = $1

      ORDER BY name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as MeetingReduced[];
}

// -----------------------------------------------------------------------------
export async function listPublicMeeting(
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT m.id, m.name, m.info, m.schedule_type, m.restricted,
        m.subscribable
      FROM meeting m
        JOIN room r ON m.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i1 ON d.identity_id = i1.id
        JOIN identity i2 ON r.identity_id = i2.id
        JOIN identity i3 ON m.identity_id = i3.id
      WHERE m.hidden = false
        AND m.enabled = true
        AND r.enabled = true
        AND d.enabled = true
        AND i1.enabled = true
        AND i2.enabled = true
        AND i3.enabled = true
      ORDER BY m.created_at DESC
      LIMIT $1 OFFSET $2`,
    args: [
      limit,
      offset,
    ],
  };

  return await fetch(sql) as MeetingPublic[];
}

// -----------------------------------------------------------------------------
export async function addMeeting(
  identityId: string,
  profileId: string,
  roomId: string,
  name: string,
  info: string,
  scheduleType: string,
  hidden: boolean,
  restricted: boolean,
  subscribable: boolean,
) {
  const sql = {
    text: `
      INSERT INTO meeting (identity_id, profile_id, room_id, name, info,
        schedule_type, hidden, restricted, subscribable)
      VALUES (
        $1,
        (SELECT id
         FROM profile
         WHERE id = $2
           AND identity_id = $1
        ),
        (SELECT id
         FROM room
         WHERE id = $3
           AND (identity_id = $1
                OR EXISTS (SELECT 1
                           FROM room_partner
                           WHERE identity_id = $1
                             AND room_id = $3
                          )
               )
        ),
        $4, $5, $6, $7, $8, $9)
      RETURNING id, created_at as at`,
    args: [
      identityId,
      profileId,
      roomId,
      name,
      info,
      scheduleType,
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
                       AND identity_id = $1
                    ),
        room_id = (SELECT id
                   FROM room
                   WHERE id = $4
                     AND (identity_id = $1
                          OR EXISTS (SELECT 1
                                     FROM room_partner
                                     WHERE identity_id = $1
                                       AND room_id = $4
                                    )
                         )
                  ),
        name = $5,
        info = $6,
        schedule_type = $7,
        hidden = $8,
        restricted = $9,
        subscribable = $10,
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

// -----------------------------------------------------------------------------
export async function updateMeetingRoomSuffix(meetingId: string) {
  const sql = {
    text: `
      UPDATE room
      SET
        suffix = DEFAULT
      WHERE id = (SELECT room_id
                  FROM meeting
                  WHERE id = $1
                 )
        AND has_suffix = true
        AND accessed_at + interval '4 hours' < now()
      RETURNING id, accessed_at as at`,
    args: [
      meetingId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateMeetingRoomAccessTime(meetingId: string) {
  const sql = {
    text: `
      UPDATE room
      SET
        accessed_at = now()
      WHERE id = (SELECT room_id
                  FROM meeting
                  WHERE id = $1
                 )
      RETURNING id, accessed_at as at`,
    args: [
      meetingId,
    ],
  };

  return await fetch(sql) as Id[];
}
