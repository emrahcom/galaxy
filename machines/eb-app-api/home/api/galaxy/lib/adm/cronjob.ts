import { listMeetingSessionForReminder } from "../database/meeting-session.ts";

// -----------------------------------------------------------------------------
// Run every 10 seconds
// -----------------------------------------------------------------------------
async function remindMeetingSession() {
  try {
    let lastCheckTime = "20240101";

    const rows = await listMeetingSessionForReminder(lastCheckTime);
    for (const row of rows) {
      console.log(row.id);
      lastCheckTime = "20240101";
    }
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(remindMeetingSession, 10 * 1000);
  }
}

// -----------------------------------------------------------------------------
export default function () {
  console.log("cronjob is started");

  // dont wait for async functions
  // each function has its own cycle
  remindMeetingSession();
}
