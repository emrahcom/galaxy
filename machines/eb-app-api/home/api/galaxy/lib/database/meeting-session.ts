import { Transaction } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import type { Attr } from "./types.ts";

// -----------------------------------------------------------------------------
function isOver(date: string, minutes: number) {
  const now = new Date();
  const time = new Date(date);
  const epoch = time.getTime() + minutes * 60 * 1000;

  return now.getTime() > epoch;
}

// -----------------------------------------------------------------------------
function checkScheduleAttrOnce(scheduleAttr: Attr) {
  if (Number(scheduleAttr.duration) < 1) {
    throw new Error("duration is out of range");
  }
  if (Number(scheduleAttr.duration) > 1440) {
    throw new Error("duration is out of range");
  }
  if (isOver(scheduleAttr.started_at, Number(scheduleAttr.duration))) {
    throw new Error("it is already over");
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
  if (
    isOver(
      scheduleAttr.started_at,
      (Number(scheduleAttr.rep_end_x) - 1) * Number(scheduleAttr.rep_every) *
          24 * 60 + Number(scheduleAttr.duration),
    )
  ) {
    throw new Error("it is already over");
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
  if (scheduleAttr.rep_end_type !== "at") {
    throw new Error("wrong rep_end_type");
  }
  if (!scheduleAttr.rep_days.match("^[01]{7}$")) {
    throw new Error("wrong rep_days");
  }
  if (Number(scheduleAttr.rep_every) < 1) {
    throw new Error("rep_every is out of range");
  }
  if (Number(scheduleAttr.rep_every) > 30) {
    throw new Error("rep_every is out of range");
  }
  if (scheduleAttr.started_at > scheduleAttr.rep_end_at) {
    throw new Error("invalid period");
  }
  if (isOver(scheduleAttr.rep_end_at, 0)) {
    throw new Error("it is already over");
  }
}

// -----------------------------------------------------------------------------
// For the client perspective (timezone), the session start date in the first
// day of the week (Sunday) to which the given date is belong. The value of
// timezoneOffset is a negative number for UTC- zones.
//
// The date argument is a date in UTC zone. So, check the timezone offset to
// correct it.
// -----------------------------------------------------------------------------
function getFirstDateOfInterval(date: Date, timezoneOffset: number) {
  const diffBefore = date.getHours() * 60 + date.getMinutes();
  const diffAfter = (24 * 60) - diffBefore;

  if ((diffAfter + timezoneOffset) <= 0) {
    return new Date(date.getTime() - (date.getDay() + 1) * 24 * 60 * 60 * 1000);
  } else if ((diffBefore - timezoneOffset) <= 0) {
    return new Date(date.getTime() - (date.getDay() - 1) * 24 * 60 * 60 * 1000);
  } else {
    return new Date(date.getTime() - date.getDay() * 24 * 60 * 60 * 1000);
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
// The structure of scheduleAttr must be checked before calling this function.
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
// The structure of scheduleAttr must be checked before calling this function.
// -----------------------------------------------------------------------------
async function addMeetingSessionDaily(
  trans: Transaction,
  meetingScheduleId: string,
  scheduleAttr: Attr,
) {
  const now = new Date();
  const started_at = new Date(scheduleAttr.started_at);
  let counter = 0;

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
    counter = counter + 1;
  }

  if (counter === 0) throw new Error("no inserted session");
}

// -----------------------------------------------------------------------------
// The structure of scheduleAttr must be checked before calling this function.
// -----------------------------------------------------------------------------
async function addMeetingSessionWeekly(
  trans: Transaction,
  meetingScheduleId: string,
  scheduleAttr: Attr,
) {
  const now = new Date();
  const started_at = new Date(scheduleAttr.started_at);
  const ended_at = new Date(scheduleAttr.rep_end_at);
  const timezoneOffset = Number(scheduleAttr.timezone_offset);
  const firstDateOfInterval = getFirstDateOfInterval(
    started_at,
    timezoneOffset,
  );
  let counter = 0;

  // loop in days of week (from Sunday (0) to Saturday (6))
  for (let i = 0; i < 7; i++) {
    // if this is not a selected day, skip it
    if (scheduleAttr.rep_days[i] !== "1") continue;

    let session_start = firstDateOfInterval.getTime() + i * 24 * 60 * 60 * 1000;
    while (session_start < ended_at.getTime()) {
      const at = new Date(session_start);
      const sql = {
        text: `
          INSERT INTO meeting_session (meeting_schedule_id, started_at,
            duration, ended_at)
          VALUES ($1, $2, $3,
            $2::timestamptz + $3::integer * interval '1 min')
          RETURNING id, created_at as at`,
        args: [
          meetingScheduleId,
          at.toISOString(),
          scheduleAttr.duration,
        ],
      };

      const session_end = session_start +
        Number(scheduleAttr.duration) * 60 * 1000;
      if (
        started_at.getTime() <= session_start &&
        now.getTime() < session_start &&
        now.getTime() < session_end
      ) {
        await trans.queryObject(sql);
        counter = counter + 1;
      }

      // jump to the next week depending on the repeat interval (every)
      session_start = session_start +
        Number(scheduleAttr.rep_every) * 7 * 24 * 60 * 60 * 1000;
    }
  }

  if (counter === 0) throw new Error("no inserted session");
}

// -----------------------------------------------------------------------------
// The structure of scheduleAttr must be checked before calling this function.
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
