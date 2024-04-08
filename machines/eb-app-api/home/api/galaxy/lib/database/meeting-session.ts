import { Transaction } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import type { Attr } from "./types.ts";

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
  if (scheduleAttr.rep_end_type !== "x") {
    throw new Error("wrong rep_end_type");
  }
  if (Number(scheduleAttr.rep_end_x) < 1) {
    throw new Error("times is out of range");
  }
  if (Number(scheduleAttr.rep_end_x) > 99) {
    throw new Error("times is out of range");
  }
  if (Number(scheduleAttr.rep_every) < 1) {
    throw new Error("rep_every is out of range");
  }
  if (Number(scheduleAttr.rep_every) > 30) {
    throw new Error("rep_every is out of range");
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
// the structure of scheduleAttr must be checked before calling this function
// -----------------------------------------------------------------------------
async function addMeetingSessionOnce(
  trans: Transaction,
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
      scheduleAttr.started_at,
      scheduleAttr.duration,
    ],
  };

  await trans.queryObject(sql);
}

// -----------------------------------------------------------------------------
// the structure of scheduleAttr must be checked before calling this function
// -----------------------------------------------------------------------------
async function addMeetingSessionDaily(
  trans: Transaction,
  meetingScheduleId: string,
  scheduleAttr: Attr,
) {
  const now = new Date();
  const started_at = new Date(scheduleAttr.started_at);

  for (let i = 0; i < Number(scheduleAttr.rep_end_x); i++) {
    const session_start = started_at.getTime() +
      i * Number(scheduleAttr.rep_every) * 24 * 60 * 60 * 1000;
    const session_end = session_start +
      Number(scheduleAttr.duration) * 60 * 1000;

    // if this session is already over, skip it
    if (now.getTime() > session_end) continue;

    const at = new Date(session_start);
    const sql = {
      text: `
        INSERT INTO meeting_session (meeting_schedule_id, started_at, duration,
          ended_at)
        VALUES ($1, $2, $3,
          $2::timestamptz + $3::integer * interval '1 min')
        RETURNING id, created_at as at`,
      args: [
        meetingScheduleId,
        at.toISOString(),
        scheduleAttr.duration,
      ],
    };

    await trans.queryObject(sql);
  }
}

// -----------------------------------------------------------------------------
// the structure of scheduleAttr must be checked before calling this function
// -----------------------------------------------------------------------------
async function addMeetingSessionWeekly(
  trans: Transaction,
  meetingScheduleId: string,
  scheduleAttr: Attr,
) {
  // not implemented yet
  await console.log(trans);
  await console.log(meetingScheduleId);
  await console.log(scheduleAttr);
}

// -----------------------------------------------------------------------------
// the structure of scheduleAttr must be checked before calling this function
// -----------------------------------------------------------------------------
export async function addMeetingSession(
  trans: Transaction,
  meetingScheduleId: string,
  scheduleAttr: Attr,
) {
  if (scheduleAttr.type === "o") {
    await addMeetingSessionOnce(trans, meetingScheduleId, scheduleAttr);
  } else if (scheduleAttr.type === "d") {
    await addMeetingSessionDaily(trans, meetingScheduleId, scheduleAttr);
  } else if (scheduleAttr.type === "w") {
    await addMeetingSessionWeekly(trans, meetingScheduleId, scheduleAttr);
  } else {
    throw new Error("Unknow schedule type");
  }
}

// -----------------------------------------------------------------------------
export async function delMeetingSessionBySchedule(
  trans: Transaction,
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

  await trans.queryObject(sql);
}
