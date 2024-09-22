import { get } from "$lib/api";

// -----------------------------------------------------------------------------
export async function ping() {
  try {
    const now = new Date().getTime();
    const pingedAt = window.localStorage.getItem("pinged_at") || "0";

    if (isNaN(Number(pingedAt))) {
      window.localStorage.setItem("pinged_at", String(now));
    }

    if (now - Number(pingedAt) > 60000) {
      window.localStorage.setItem("pinged_at", String(now));
      await get("/api/pri/intercom/ping");
    }
  } finally {
    setTimeout(ping, 60000);
  }
}
