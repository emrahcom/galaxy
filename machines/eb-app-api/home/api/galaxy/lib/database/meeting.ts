import { fetch } from "./common.ts";
import type {
  Id,
  Meeting,
  Meeting000,
  Meeting222,
  MeetingLinkset,
} from "./types.ts";

// -----------------------------------------------------------------------------
export async function getMeeting(identityId: string, meetingId: string) {
  const sql = {
    text: `
      SELECT m.id, m.name, m.info, pr.id as profile_id, pr.name as profile_name,
        pr.email as profile_email, d.id as domain_id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        d.enabled as domain_enabled, r.id as room_id, r.name as room_name,
        r.enabled as room_enabled, r.ephemeral as room_ephemeral,
        m.schedule_type, m.hidden, m.restricted, m.subscribable, m.enabled,
        m.created_at, m.updated_at
      FROM meeting m
        JOIN room r ON m.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        LEFT JOIN profile pr ON m.profile_id = pr.id
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
// consumer is public
// -----------------------------------------------------------------------------

// WARNING: add status checks
// WARNING: is id needed? Check in the context of secrity

export async function getPublicMeeting(meetingId: string) {
  const sql = {
    text: `
      SELECT id, name, info, schedule_type, restricted, subscribable
      FROM meeting
      WHERE id = $1
        AND NOT hidden`,
    args: [
      meetingId,
    ],
  };

  return await fetch(sql) as Meeting000[];
}

// -----------------------------------------------------------------------------
// consumer is owner but object isn't sent to the client side.
// -----------------------------------------------------------------------------
export async function getMeetingLinkset(identityId: string, meetingId: string) {
  const sql = {
    text: `
      SELECT m.id, m.name, r.name as room_name, s.name as schedule_name,
        r.has_suffix, r.suffix, d.auth_type, d.domain_attr, 'host' as join_as,
        ses.started_at, ses.ended_at, ses.duration,
        extract('epoch' from age(ses.ended_at, now()))::integer as remaining,
        pr.name as profile_name, pr.email as profile_email
      FROM meeting m
        JOIN room r ON m.room_id = r.id
                       AND r.enabled
        JOIN domain d ON r.domain_id = d.id
                         AND d.enabled
        JOIN identity i1 ON d.identity_id = i1.id
                            AND i1.enabled
        JOIN identity i2 ON r.identity_id = i2.id
                            AND i2.enabled
        LEFT JOIN meeting_schedule s ON m.id = s.meeting_id
                                        AND s.enabled
        LEFT JOIN meeting_session ses ON s.id = ses.meeting_schedule_id
        LEFT JOIN profile pr ON m.profile_id = pr.id
      WHERE m.id = $2
        AND m.identity_id = $1
        AND (r.identity_id = $1
             OR EXISTS (SELECT 1
                        FROM room_partner
                        WHERE identity_id = $1
                          AND room_id = r.id
                          AND enabled
                       )
            )
        AND (d.public
             OR d.identity_id = r.identity_id
             OR EXISTS (SELECT 1
                        FROM domain_partner
                        WHERE identity_id = r.identity_id
                          AND domain_id = d.id
                          AND enabled
                       )
            )
        AND (m.schedule_type != 'scheduled'
             OR ses.ended_at > now()
            )
      ORDER BY ses.started_at
      LIMIT 1
        `,
    args: [
      identityId,
      meetingId,
    ],
  };

  const linkset = await fetch(sql) as MeetingLinkset[];
  await updateMeetingRoomSuffix(linkset[0].id);
  await updateMeetingRoomAccessTime(linkset[0].id);
  await updateMeetingAccessTime(linkset[0].id);

  return await fetch(sql) as MeetingLinkset[];
}

// -----------------------------------------------------------------------------
// consumer is member but object isn't sent to the client side.
// -----------------------------------------------------------------------------
export async function getMeetingLinksetByMembership(
  identityId: string,
  membershipId: string,
) {
  const sql = {
    text: `
      SELECT m.id, m.name, r.name as room_name, s.name as schedule_name,
        r.has_suffix, r.suffix, d.auth_type, d.domain_attr, mem.join_as,
        ses.started_at, ses.ended_at, ses.duration,
        extract('epoch' from age(ses.ended_at, now()))::integer as remaining,
        pr.name as profile_name, pr.email as profile_email
      FROM meeting_member mem
        JOIN meeting m ON mem.meeting_id = m.id
                          AND m.enabled
        JOIN room r ON m.room_id = r.id
                       AND r.enabled
        JOIN domain d ON r.domain_id = d.id
                         AND d.enabled
        JOIN identity i1 ON d.identity_id = i1.id
                            AND i1.enabled
        JOIN identity i2 ON r.identity_id = i2.id
                            AND i2.enabled
        JOIN identity i3 ON m.identity_id = i3.id
                            AND i3.enabled
        LEFT JOIN meeting_schedule s ON m.id = s.meeting_id
                                        AND s.enabled
        LEFT JOIN meeting_session ses ON s.id = ses.meeting_schedule_id
        LEFT JOIN profile pr ON mem.profile_id = pr.id
      WHERE mem.id = $2
        AND mem.identity_id = $1
        AND mem.enabled
        AND CASE mem.join_as
              WHEN 'host' THEN true
              ELSE (m.schedule_type != 'scheduled'
                    OR (ses.started_at - interval '1 min' < now()
                        AND ses.ended_at > now()
                       )
                   )
            END
        AND (r.identity_id = m.identity_id
             OR EXISTS (SELECT 1
                        FROM room_partner
                        WHERE identity_id = m.identity_id
                          AND room_id = r.id
                          AND enabled
                       )
            )
        AND (d.public
             OR d.identity_id = r.identity_id
             OR EXISTS (SELECT 1
                        FROM domain_partner
                        WHERE identity_id = r.identity_id
                          AND domain_id = d.id
                          AND enabled
                       )
            )
        AND (m.schedule_type != 'scheduled'
             OR ses.ended_at > now()
            )
      ORDER BY ses.started_at
      LIMIT 1
        `,
    args: [
      identityId,
      membershipId,
    ],
  };

  const linkset = await fetch(sql) as MeetingLinkset[];
  await updateMeetingRoomSuffix(linkset[0].id);
  await updateMeetingRoomAccessTime(linkset[0].id);
  await updateMeetingAccessTime(linkset[0].id);

  return await fetch(sql) as MeetingLinkset[];
}

// -----------------------------------------------------------------------------
// consumer is audience but object isn't sent to the client side.
// -----------------------------------------------------------------------------
export async function getMeetingLinksetByCode(code: string) {
  const sql = {
    text: `
      SELECT m.id, m.name, r.name as room_name, s.name as schedule_name,
        r.has_suffix, r.suffix, d.auth_type, d.domain_attr, iv.join_as,
        ses.started_at, ses.ended_at, ses.duration,
        extract('epoch' from age(ses.ended_at, now()))::integer as remaining,
        '' as profile_name, '' as profile_email
      FROM meeting_invite iv
        JOIN meeting m ON iv.meeting_id = m.id
                          AND m.enabled
        JOIN room r ON m.room_id = r.id
                       AND r.enabled
        JOIN domain d ON r.domain_id = d.id
                         AND d.enabled
        JOIN identity i1 ON d.identity_id = i1.id
                            AND i1.enabled
        JOIN identity i2 ON r.identity_id = i2.id
                            AND i2.enabled
        JOIN identity i3 ON m.identity_id = i3.id
                            AND i3.enabled
        LEFT JOIN meeting_schedule s ON m.id = s.meeting_id
                                        AND s.enabled
        LEFT JOIN meeting_session ses ON s.id = ses.meeting_schedule_id
      WHERE iv.code = $1
        AND iv.enabled
        AND iv.invite_to = 'audience'
        AND iv.expired_at > now()
        AND CASE iv.join_as
              WHEN 'host' THEN true
              ELSE (m.schedule_type != 'scheduled'
                    OR (ses.started_at - interval '1 min' < now()
                        AND ses.ended_at > now()
                       )
                   )
            END
        AND (r.identity_id = m.identity_id
             OR EXISTS (SELECT 1
                        FROM room_partner
                        WHERE identity_id = m.identity_id
                          AND room_id = r.id
                          AND enabled
                       )
            )
        AND (d.public
             OR d.identity_id = r.identity_id
             OR EXISTS (SELECT 1
                        FROM domain_partner
                        WHERE identity_id = r.identity_id
                          AND domain_id = d.id
                          AND enabled
                       )
            )
        AND (m.schedule_type != 'scheduled'
             OR ses.ended_at > now()
            )
      ORDER BY ses.started_at
      LIMIT 1`,
    args: [
      code,
    ],
  };

  const linkset = await fetch(sql) as MeetingLinkset[];
  await updateMeetingRoomSuffix(linkset[0].id);
  await updateMeetingRoomAccessTime(linkset[0].id);
  await updateMeetingAccessTime(linkset[0].id);

  return await fetch(sql) as MeetingLinkset[];
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
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        r.name as room_name, r.ephemeral as room_ephemeral, m.schedule_type,
        (CASE m.schedule_type
           WHEN 'scheduled' THEN array(SELECT started_at
                                       FROM meeting_session
                                       WHERE meeting_schedule_id IN (
                                           SELECT id
                                           FROM meeting_schedule
                                           WHERE meeting_id = m.id
                                             AND enabled
                                         )
                                         AND ended_at > now()
                                       ORDER BY started_at
                                      )
           ELSE array[]::timestamp with time zone[]
         END
        ) as session_list,
        (CASE m.schedule_type
           WHEN 'scheduled' THEN (SELECT min(started_at)
                                  FROM meeting_session
                                  WHERE meeting_schedule_id IN (
                                      SELECT id
                                      FROM meeting_schedule
                                      WHERE meeting_id = m.id
                                        AND enabled
                                    )
                                    AND ended_at > now()
                                 )
           WHEN 'ephemeral' THEN CURRENT_DATE
           ELSE CURRENT_DATE + 1
         END
        ) as session_at,
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
        ) as chain_enabled, m.updated_at, 'owner' as ownership,
        m.id as membership_id, 'host' as join_as
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
        '' as room_name, r.ephemeral as room_ephemeral, m.schedule_type,
        (CASE m.schedule_type
           WHEN 'scheduled' THEN array(SELECT started_at
                                       FROM meeting_session
                                       WHERE meeting_schedule_id IN (
                                           SELECT id
                                           FROM meeting_schedule
                                           WHERE meeting_id = m.id
                                             AND enabled
                                         )
                                         AND ended_at > now()
                                       ORDER BY started_at
                                      )
           ELSE array[]::timestamp with time zone[]
         END
        ) as session_list,
        (CASE m.schedule_type
           WHEN 'scheduled' THEN (SELECT min(started_at)
                                  FROM meeting_session
                                  WHERE meeting_schedule_id IN (
                                      SELECT id
                                      FROM meeting_schedule
                                      WHERE meeting_id = m.id
                                        AND enabled
                                    )
                                    AND ended_at > now()
                                 )
           WHEN 'ephemeral' THEN CURRENT_DATE
           ELSE CURRENT_DATE + 1
         END
        ) as session_at,
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
        ) as chain_enabled, m.updated_at, 'member' as ownership,
        mem.id as membership_id, mem.join_as
      FROM meeting_member mem
        JOIN meeting m ON mem.meeting_id = m.id
        JOIN room r ON m.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i1 ON d.identity_id = i1.id
        JOIN identity i2 ON r.identity_id = i2.id
        JOIN identity i3 ON m.identity_id = i3.id
      WHERE mem.identity_id = $1

      ORDER BY session_at, name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Meeting222[];
}

// -----------------------------------------------------------------------------
// consumer is public
// -----------------------------------------------------------------------------

// WARNING: add partnership status too
// WARNING: is id needed? Check in the context of secrity

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
                       AND r.enabled
        JOIN domain d ON r.domain_id = d.id
                         AND d.enabled
        JOIN identity i1 ON d.identity_id = i1.id
                            AND i1.enabled
        JOIN identity i2 ON r.identity_id = i2.id
                            AND i2.enabled
        JOIN identity i3 ON m.identity_id = i3.id
                            AND i3.enabled
      WHERE NOT m.hidden
        AND m.enabled
      ORDER BY m.created_at DESC
      LIMIT $1 OFFSET $2`,
    args: [
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Meeting000[];
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
        AND has_suffix
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
        accessed_at = now(),
        attendance = attendance + 1
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

// -----------------------------------------------------------------------------
export async function updateMeetingAccessTime(meetingId: string) {
  const sql = {
    text: `
      UPDATE meeting
      SET
        accessed_at = now(),
        attendance = attendance + 1
      WHERE id = $1
      RETURNING id, accessed_at as at`,
    args: [
      meetingId,
    ],
  };

  return await fetch(sql) as Id[];
}
