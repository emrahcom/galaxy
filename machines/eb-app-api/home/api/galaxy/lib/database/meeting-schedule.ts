import { fetch } from "./common.ts";
import type {
  Id,
  MeetingSchedule,
  MeetingSchedule111,
  MeetingSchedule222,
} from "./types.ts";

// -----------------------------------------------------------------------------
export async function getMeetingSchedule(
  identityId: string,
  scheduleId: string,
) {
  const sql = {
    text: `
      SELECT id, meeting_id, name, schedule_attr, enabled, created_at,
        updated_at
      FROM meeting_schedule
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = meeting_id
                      AND identity_id = $1
                   )`,
    args: [
      identityId,
      scheduleId,
    ],
  };

  return await fetch(sql) as MeetingSchedule[];
}

// -----------------------------------------------------------------------------
// consumer is owner
// -----------------------------------------------------------------------------
export async function getMeetingScheduleByMeeting(
  identityId: string,
  meetingId: string,
) {
  const sql = {
    text: `
      SELECT m.id, m.name as meeting_name, m.info as meeting_info,
        s.name as schedule_name, s.started_at, s.ended_at, s.duration,
        extract('epoch' from age(started_at, now()))::integer as waiting_time,
        'host' as join_as
      FROM meeting m
        JOIN room r ON m.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i1 ON d.identity_id = i1.id
        JOIN identity i2 ON r.identity_id = i2.id
        JOIN identity i3 ON m.identity_id = i3.id
        JOIN meeting_schedule s ON m.id = s.meeting_id
      WHERE m.id = $2
        AND m.identity_id = $1
        AND m.enabled
        AND r.enabled
        AND d.enabled
        AND i1.enabled
        AND i2.enabled
        AND i3.enabled
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
        AND s.ended_at > now()
      ORDER BY s.started_at
      LIMIT 1`,
    args: [
      identityId,
      meetingId,
    ],
  };

  return await fetch(sql) as MeetingSchedule222[];
}

// -----------------------------------------------------------------------------
// consumer is member
// add some random delay for guests to prevent them to login at the same time
// -----------------------------------------------------------------------------
export async function getMeetingScheduleByMembership(
  identityId: string,
  meetingId: string,
) {
  const sql = {
    text: `
      SELECT mem.id, m.name as meeting_name, m.info as meeting_info,
        s.name as schedule_name, s.started_at, s.ended_at, s.duration,
        extract('epoch' from age(started_at, now()))::integer
          + CASE mem.join_as
              WHEN 'host' THEN 0
              WHEN 'guest' THEN 3 + floor(random()*27)
            END as waiting_time,
        mem.join_as
      FROM meeting_member mem
        JOIN meeting m ON mem.meeting_id = m.id
        JOIN room r ON m.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i1 ON d.identity_id = i1.id
        JOIN identity i2 ON r.identity_id = i2.id
        JOIN identity i3 ON m.identity_id = i3.id
        JOIN meeting_schedule s ON m.id = s.meeting_id
      WHERE mem.id = $2
        AND mem.identity_id = $1
        AND mem.enabled
        AND m.enabled
        AND r.enabled
        AND d.enabled
        AND i1.enabled
        AND i2.enabled
        AND i3.enabled
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
        AND s.ended_at > now()
      ORDER BY s.started_at
      LIMIT 1`,
    args: [
      identityId,
      meetingId,
    ],
  };

  return await fetch(sql) as MeetingSchedule222[];
}

// -----------------------------------------------------------------------------
// consumer is audience
// add some random delay for guests to prevent them to login at the same time
// -----------------------------------------------------------------------------
export async function getMeetingScheduleByCode(code: string) {
  const sql = {
    text: `
      SELECT iv.code, m.name as meeting_name, m.info as meeting_info,
        s.name as schedule_name, s.started_at, s.ended_at, s.duration,
        extract('epoch' from age(started_at, now()))::integer
          + CASE iv.join_as
              WHEN 'host' THEN 0
              WHEN 'guest' THEN 3 + floor(random()*27)
            END as waiting_time,
        iv.join_as
      FROM meeting_invite iv
        JOIN meeting m ON iv.meeting_id = m.id
        JOIN room r ON m.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i1 ON d.identity_id = i1.id
        JOIN identity i2 ON r.identity_id = i2.id
        JOIN identity i3 ON m.identity_id = i3.id
        JOIN meeting_schedule s ON m.id = s.meeting_id
      WHERE iv.code = $1
        AND iv.enabled
        AND iv.invite_to = 'audience'
        AND iv.expired_at > now()
        AND m.enabled
        AND r.enabled
        AND d.enabled
        AND i1.enabled
        AND i2.enabled
        AND i3.enabled
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
        AND s.ended_at > now()
      ORDER BY s.started_at
      LIMIT 1`,
    args: [
      code,
    ],
  };

  return await fetch(sql) as MeetingSchedule111[];
}

// -----------------------------------------------------------------------------
export async function listMeetingScheduleByMeeting(
  identityId: string,
  meetingId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT id, meeting_id, name, schedule_attr, enabled, created_at,
        updated_at
      FROM meeting_schedule s
      WHERE meeting_id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = $2
                      AND identity_id = $1
                   )
        AND EXISTS (SELECT 1
                    FROM meeting_session
                    WHERE meeting_schedule_id = s.id
                      AND ended_at + interval '20 mins' > now()
                   )
      ORDER BY name
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      meetingId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as MeetingSchedule[];
}

// -----------------------------------------------------------------------------
export async function addMeetingSchedule(
  identityId: string,
  meetingId: string,
  name: string,
  scheduleAttr: unknown,
) {
  const sql = {
    text: `
      INSERT INTO meeting_schedule (meeting_id, name, schedule_attr)
      VALUES (
        (SELECT id
         FROM meeting
         WHERE id = $2
           AND identity_id = $1
        ),
        $3, $4::jsonb
      )
      RETURNING id, now() as at`,
    args: [
      identityId,
      meetingId,
      name,
      scheduleAttr,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delMeetingSchedule(
  identityId: string,
  scheduleId: string,
) {
  const sql = {
    text: `
      DELETE FROM meeting_schedule
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = meeting_id
                      AND identity_id = $1
                   )
      RETURNING id, now() as at`,
    args: [
      identityId,
      scheduleId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updateMeetingSchedule(
  identityId: string,
  scheduleId: string,
  name: string,
  started_at: string,
  duration: number,
) {
  if (duration < 1) throw new Error("duration is out of range");
  if (duration > 1440) throw new Error("duration is out of range");

  const sql = {
    text: `
      UPDATE meeting_schedule
      SET
        name = $3,
        started_at = $4,
        duration = $5,
        ended_at = $4::timestamptz + $5::integer * interval '1 min'
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = meeting_id
                      AND identity_id = $1
                   )
      RETURNING id, now() as at`,
    args: [
      identityId,
      scheduleId,
      name,
      started_at,
      duration,
    ],
  };

  return await fetch(sql) as Id[];
}
