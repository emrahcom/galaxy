import { Toast } from "bootstrap";
import { actionById, list } from "$lib/api";
import type { IntercomMessage } from "$lib/types";

// -----------------------------------------------------------------------------
function addNotificationCall(msgId: string) {
  const container = document.getElementById("notifications");
  if (!container) return;

  const oldToast = document.getElementById(`msg-${msgId}`);
  if (oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.id = `msg-${msgId}`;
  toast.setAttribute("class", "toast");
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");
  toast.setAttribute("data-bs-autohide", "false");
  toast.innerHTML = `
    <div class="toast-body">
      ${msgId}
    </div>
  `;
  container.appendChild(toast);
  Toast.getOrCreateInstance(toast).show();
}

// -----------------------------------------------------------------------------
async function callHandler(msg: IntercomMessage) {
  try {
    // set as seen
    await actionById("/api/pri/intercom/set/seen", msg.id);

    addNotificationCall(msg.id);
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
