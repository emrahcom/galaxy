import { checkAttr, fetch, pool } from "./common.ts";
import type {
  Attr,
  Id,
  MeetingSchedule,
  MeetingSchedule111,
  MeetingSchedule222,
} from "./types.ts";
import {
  addMeetingSession,
  checkScheduleAttr,
  delMeetingSessionBySchedule,
} from "./meeting-session.ts";

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
        s.name as schedule_name, ses.started_at, ses.ended_at, ses.duration,
        extract('epoch' from age(ses.started_at, now()))::integer
        as waiting_time, 'host' as join_as
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
        JOIN meeting_schedule s ON m.id = s.meeting_id
                                   AND s.enabled
        JOIN meeting_session ses ON s.id = ses.meeting_schedule_id
      WHERE m.id = $2
        AND m.identity_id = $1
        AND m.enabled
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
        AND ses.ended_at > now()
      ORDER BY ses.started_at
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
        s.name as schedule_name, ses.started_at, ses.ended_at, ses.duration,
        extract('epoch' from age(ses.started_at, now()))::integer
          + CASE mem.join_as
              WHEN 'host' THEN 0
              WHEN 'guest' THEN 3 + floor(random()*27)
            END as waiting_time,
        mem.join_as
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
        JOIN meeting_schedule s ON m.id = s.meeting_id
                            AND s.enabled
        JOIN meeting_session ses ON s.id = ses.meeting_schedule_id
      WHERE mem.id = $2
        AND mem.identity_id = $1
        AND mem.enabled
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
        AND ses.ended_at > now()
      ORDER BY ses.started_at
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
        s.name as schedule_name, ses.started_at, ses.ended_at, ses.duration,
        extract('epoch' from age(ses.started_at, now()))::integer
          + CASE iv.join_as
              WHEN 'host' THEN 0
              WHEN 'guest' THEN 3 + floor(random()*27)
            END as waiting_time,
        iv.join_as
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
        JOIN meeting_schedule s ON m.id = s.meeting_id
                                   AND s.enabled
        JOIN meeting_session ses ON s.id = ses.meeting_schedule_id
      WHERE iv.code = $1
        AND iv.enabled
        AND iv.invite_to = 'audience'
        AND iv.expired_at > now()
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
        AND ses.ended_at > now()
      ORDER BY ses.started_at
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
      SELECT s.id, s.meeting_id, s.name, s.schedule_attr, s.enabled,
        s.created_at, s.updated_at
      FROM meeting_schedule s
        JOIN meeting_session ses ON s.id = ses.meeting_schedule_id
      WHERE meeting_id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = $2
                      AND identity_id = $1
                   )
        AND ses.ended_at + interval '20 mins' > now()
      ORDER BY ses.started_at
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
  scheduleAttr: Attr,
) {
  // it will throw an error if it is not valid
  checkAttr(scheduleAttr);
  checkScheduleAttr(scheduleAttr);

  using client = await pool.connect();
  const trans = client.createTransaction("transaction");
  await trans.begin();

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
  const rows = await trans.queryObject(sql)
    .then((rst) => {
      return rst.rows as Id[];
    });

  // add sessions
  await addMeetingSession(trans, rows[0].id, scheduleAttr);

  await trans.commit();

  return rows;
}

// -----------------------------------------------------------------------------
export async function delMeetingSchedule(
  identityId: string,
  scheduleId: string,
) {
  const sql = {
    text: `
      DELETE FROM meeting_schedule s
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = s.meeting_id
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
  scheduleAttr: Attr,
) {
  // it will throw an error if it is not valid
  checkAttr(scheduleAttr);
  checkScheduleAttr(scheduleAttr);

  using client = await pool.connect();
  const trans = client.createTransaction("transaction");
  await trans.begin();

  const sql = {
    text: `
      UPDATE meeting_schedule s
      SET
        name = $3,
        schedule_attr = $4
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = s.meeting_id
                      AND identity_id = $1
                   )
      RETURNING id, now() as at`,
    args: [
      identityId,
      scheduleId,
      name,
      scheduleAttr,
    ],
  };
  const rows = await trans.queryObject(sql)
    .then((rst) => {
      return rst.rows as Id[];
    });

  // dont continue if the schedule was not updated
  if (rows[0] === undefined) throw new Error("No updated schedule");

  // delete old sessions
  await delMeetingSessionBySchedule(trans, scheduleId);

  // add new sessions
  await addMeetingSession(trans, rows[0].id, scheduleAttr);

  await trans.commit();

  return rows;
}

// -----------------------------------------------------------------------------
export async function updateMeetingScheduleEnabled(
  identityId: string,
  scheduleId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE meeting_schedule s
      SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2
        AND EXISTS (SELECT 1
                    FROM meeting
                    WHERE id = s.meeting_id
                      AND identity_id = $1
                   )
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      scheduleId,
      value,
    ],
  };

  return await fetch(sql) as Id[];
}
