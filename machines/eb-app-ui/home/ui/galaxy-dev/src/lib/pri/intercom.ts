import { actionById, list } from "$lib/api";
import type { IntercomMessage } from "$lib/types";

// -----------------------------------------------------------------------------
async function callHandler(msg: IntercomMessage) {
  try {
    // set as seen
    await actionById("/api/pri/intercom/set/seen", msg.id);
  } catch {
    // do nothing
  }
}

// -----------------------------------------------------------------------------
export async function intercomHandler() {
  try {
    const now = new Date().getTime();
    const checkedAt = window.localStorage.getItem("intercom_checked_at") || "0";

    if (isNaN(Number(checkedAt))) {
      window.localStorage.setItem("intercom_checked_at", String(now));
    }

    if (now - Number(checkedAt) > 3000) {
      window.localStorage.setItem("intercom_checked_at", String(now));

      const messages: IntercomMessage[] = await list(
        "/api/pri/intercom/list",
        10,
      );
      for (const msg of messages) {
        if (msg.message_type === "call") {
          callHandler(msg);
        }
      }
    }
  } finally {
    setTimeout(intercomHandler, 3000);
  }
}
