import { fetch } from "./common.ts";
import type { Id, MeetingSchedule, MeetingSchedule222 } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getMeetingSchedule(
  identityId: string,
  scheduleId: string,
) {
  const sql = {
    text: `
      SELECT id, meeting_id, name, started_at, ended_at, duration
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
export async function getMeetingScheduleByMeeting(
  identityId: string,
  meetingId: string,
) {
  const sql = {
    text: `
      SELECT m.id as meeting_id, m.name as meeting_name,
        s.name as schedule_name, s.started_at, s.ended_at, s.duration
      FROM meeting_schedule s
        JOIN meeting m ON s.meeting_id = m.id
        JOIN room r ON m.room_id = r.id
        JOIN domain d ON r.domain_id = d.id
        JOIN identity i1 ON d.identity_id = i1.id
        JOIN identity i2 ON r.identity_id = i2.id
        JOIN identity i3 ON m.identity_id = i3.id
      WHERE s.meeting_id = $2
        AND s.ended_at > now()
        AND m.enabled
        AND r.enabled
        AND d.enabled
        AND i1.enabled
        AND i2.enabled
        AND i3.enabled
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
        AND (m.identity_id = $1
             OR EXISTS (SELECT 1
                        FROM meeting_member
                        WHERE identity_id = $1
                          AND meeting_id = $2
                          AND enabled
                       )
            )
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
export async function listMeetingScheduleByMeeting(
  identityId: string,
  meetingId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT id, meeting_id, name, started_at, ended_at, duration
      FROM meeting_schedule
      WHERE meeting_id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = $2
                      AND identity_id = $1
                   )
        AND ended_at + interval '20 mins' > now()
      ORDER BY started_at
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
  started_at: string,
  duration: number,
) {
  if (duration < 1) throw new Error("duration is out of range");
  if (duration > 1440) throw new Error("duration is out of range");

  const sql = {
    text: `
      INSERT INTO meeting_schedule (meeting_id, name, started_at, duration,
        ended_at)
      VALUES (
        (SELECT id
         FROM meeting
         WHERE id = $2
           AND identity_id = $1
        ),
        $3, $4, $5,
        $4::timestamptz + $5::integer * interval '1 min'
      )
      RETURNING id, now() as at`,
    args: [
      identityId,
      meetingId,
      name,
      started_at,
      duration,
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
