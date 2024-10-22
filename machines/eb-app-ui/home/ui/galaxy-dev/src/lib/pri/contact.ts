import { list } from "$lib/api";
import type { ContactStatus } from "$lib/types";

// -----------------------------------------------------------------------------
export async function contactStatusHandler() {
  try {
    const now = new Date().getTime();
    const checkedAt =
      globalThis.localStorage.getItem("contact_checked_at") || "0";

    if (isNaN(Number(checkedAt))) {
      globalThis.localStorage.setItem("contact_checked_at", String(now));
    }

    if (now - Number(checkedAt) > 40000) {
      globalThis.localStorage.setItem("contact_checked_at", String(now));

      const status: ContactStatus[] = await list(
        "/api/pri/contact/list/status",
        1000,
      );
      console.error(status);
    }
  } finally {
    setTimeout(contactStatusHandler, 40000);
  }
}
