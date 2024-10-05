import { list } from "$lib/api";
import type { IntercomMessage } from "$lib/types";

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
      const messages: IntercomMessage = await list(
        "/api/pri/intercom/list",
        10,
      );
      console.error(messages);
    }
  } finally {
    setTimeout(intercomHandler, 3000);
  }
}
