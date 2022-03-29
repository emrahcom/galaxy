import { fetch } from "./common.ts";
import type { Id, MeetingSchedule } from "./types.ts";

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
        $4::timestamptz + $5 * interval '1 min'
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
  const sql = {
    text: `
      UPDATE meeting_schedule
      SET
        name = $3,
        started_at = $4,
        duration = $5,
        ended_at = $4::timestamptz + $5 * interval '1 min'
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
