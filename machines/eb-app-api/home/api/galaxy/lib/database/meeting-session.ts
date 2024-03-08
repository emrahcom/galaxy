import { fetch } from "./common.ts";
import type { Attr, Id } from "./types.ts";

// -----------------------------------------------------------------------------
export async function addMeetingSessionOnce(
  meetingId: string,
  scheduleAttr: Attr,
) {
  const sql = {
    text: `
      INSERT INTO meeting_session (meeting_schedule_id, started_at, duration,
        ended_at)
      VALUES ($1, $2, $3,
        $2::timestamptz + $3::integer * interval '1 min')
      RETURNING id, created_at as at`,
    args: [
      meetingId,
      scheduleAttr.once_started_at,
      scheduleAttr.once_duration,
    ],
  };

  return await fetch(sql) as Id[];
}
