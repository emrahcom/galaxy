import { fetch } from "./common.ts";
import type { Attr, Id } from "./types.ts";

// -----------------------------------------------------------------------------
function checkScheduleAttrOnce(scheduleAttr: Attr) {
  if (Number(scheduleAttr.duration) < 1) {
    throw new Error("duration is out of range");
  }

  if (Number(scheduleAttr.duration) > 1440) {
    throw new Error("duration is out of range");
  }
}

// -----------------------------------------------------------------------------
function checkScheduleAttrDaily(scheduleAttr: Attr) {
  if (Number(scheduleAttr.duration) < 1) {
    throw new Error("duration is out of range");
  }

  if (Number(scheduleAttr.duration) > 1440) {
    throw new Error("duration is out of range");
  }
}

// -----------------------------------------------------------------------------
function checkScheduleAttrWeekly(scheduleAttr: Attr) {
  if (Number(scheduleAttr.duration) < 1) {
    throw new Error("duration is out of range");
  }

  if (Number(scheduleAttr.duration) > 1440) {
    throw new Error("duration is out of range");
  }
}

// -----------------------------------------------------------------------------
export function checkScheduleAttr(scheduleAttr: Attr) {
  if (scheduleAttr.type === "o") {
    checkScheduleAttrOnce(scheduleAttr);
  } else if (scheduleAttr.type === "d") {
    checkScheduleAttrDaily(scheduleAttr);
  } else if (scheduleAttr.type === "w") {
    checkScheduleAttrWeekly(scheduleAttr);
  } else {
    throw new Error("Unknow schedule type");
  }
}

// -----------------------------------------------------------------------------
export async function addMeetingSessionOnce(
  meetingScheduleId: string,
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
      meetingScheduleId,
      scheduleAttr.once_started_at,
      scheduleAttr.once_duration,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delMeetingSessionBySchedule(
  meetingScheduleId: string,
) {
  const sql = {
    text: `
      DELETE FROM meeting_session
      WHERE meeting_schedule_id = $1
      RETURNING id, created_at as at`,
    args: [
      meetingScheduleId,
    ],
  };

  return await fetch(sql) as Id[];
}
