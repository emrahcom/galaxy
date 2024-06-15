import { fetch } from "./common.ts";
import {
  dateAfterXDays,
  getFirstDayOfMonth,
  getFirstDayOfWeek,
} from "../common/helper.ts";
import type { MeetingSchedule222 } from "./types.ts";

// -----------------------------------------------------------------------------
export async function listSessionByMonth(
  identityId: string,
  date: string,
  limit: number,
  offset: number,
) {
  // First, find the first day of the month then find the first day of the week
  // which this day belongs to. Don't use this day as the beginning of the
  // period because dates in databases are in UTC but UI may use a different
  // time zone. So, take one day earlier as the beginning of the period. UI will
  // filter out the date which are not in UI time zone.
  const firstOfMonth = getFirstDayOfMonth(date);
  const firstOfWeek = getFirstDayOfWeek(firstOfMonth);
  const firstDay = dateAfterXDays(firstOfWeek, -1);
  const lastDay = dateAfterXDays(firstDay, 33);

  const sql = {
    text: `
      SELECT DISTINCT ON (id, started_at)
        id, meeting_name, meeting_info, schedule_name, started_at, ended_at,
        duration, waiting_time, join_as
      FROM (
        SELECT m.id, m.name as meeting_name, m.info as meeting_info,
          s.name as schedule_name, ses.started_at, ses.ended_at, ses.duration,
          0 as waiting_time, 'host' as join_as, 0 as priority
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
        WHERE m.identity_id = $1
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
          AND ses.started_at > $2
          AND ses.started_at < $3

        UNION

        SELECT m.id, m.name as meeting_name, m.info as meeting_info,
          s.name as schedule_name, ses.started_at, ses.ended_at, ses.duration,
          0 as waiting_time, mem.join_as, 1 as priority
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
        WHERE mem.identity_id = $1
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
          AND ses.started_at > $2
          AND ses.started_at < $3

        ORDER BY started_at
      ) AS combined
      ORDER BY started_at
      LIMIT $4 OFFSET $5`,
    args: [
      identityId,
      firstDay,
      lastDay,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as MeetingSchedule222[];
}
