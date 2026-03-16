import { mailMeetingSession } from "../common/mail.ts";
import { listMeetingSessionForReminder } from "../database/meeting-session.ts";
import { Timers } from "./types.ts";

// -----------------------------------------------------------------------------
// Run every 30 seconds
// -----------------------------------------------------------------------------
async function remindMeetingSession(
  t: Timers,
  signal: AbortSignal,
  lastCheckTime = "2024-10-01T00:00:00.000Z",
) {
  if (signal.aborted) return;

  try {
    const rows = await listMeetingSessionForReminder(lastCheckTime);

    for (const row of rows) {
      if (signal.aborted) break;

      // Dont care failed mail.
      // Wait for each mail before processing the next one.
      // For now, I dont want to send all mails at the same second. One by one.
      await mailMeetingSession(row);

      lastCheckTime = row.started_at;
    }
  } catch (e) {
    console.log(e);
  }

  if (signal.aborted) return;

  t.cronjob = setTimeout(
    () => remindMeetingSession(t, signal, lastCheckTime),
    30 * 1000,
  );
}

// -----------------------------------------------------------------------------
export default function (t: Timers, signal: AbortSignal) {
  console.log("cronjob is started");

  // dont wait for async functions
  // each function has its own cycle
  remindMeetingSession(t, signal);
}
