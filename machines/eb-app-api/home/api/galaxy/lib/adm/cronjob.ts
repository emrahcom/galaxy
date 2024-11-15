import { listMeetingSessionForReminder } from "../database/meeting-session.ts";

// -----------------------------------------------------------------------------
// Run every 10 seconds
// -----------------------------------------------------------------------------
async function remindMeetingSession(
  lastCheckTime = "2024-10-01T00:00:00.000Z",
) {
  try {
    const rows = await listMeetingSessionForReminder(lastCheckTime);
    for (const row of rows) {
      console.log(row.id);
      lastCheckTime = row.started_at;
    }
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => remindMeetingSession(lastCheckTime), 10 * 1000);
  }
}

// -----------------------------------------------------------------------------
export default function () {
  console.log("cronjob is started");

  // dont wait for async functions
  // each function has its own cycle
  remindMeetingSession();
}
