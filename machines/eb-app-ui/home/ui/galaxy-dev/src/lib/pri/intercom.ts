import { Toast } from "bootstrap";
import { actionById, getById, list } from "$lib/api";
import { isOver } from "$lib/common";
import type { IntercomMessage } from "$lib/types";

// -----------------------------------------------------------------------------
function addNotificationCall(msg: IntercomMessage) {
  const container = document.getElementById("notifications");
  if (!container) return;

  const oldToast = document.getElementById(`msg-${msg.id}`);
  if (oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.id = `msg-${msg.id}`;
  toast.setAttribute("class", "toast");
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");
  toast.setAttribute("data-bs-autohide", "false");
  toast.innerHTML = `
    <div class="toast-body">
      <i class="bi bi-telephone fs-5 text-primary m-2"></i>
      <span class="fs-6 fw-bold">${msg.contact_name}</span>
      <span class="fs-6">is calling...</span>
      <audio id="ringtone" src="/ringing.mp3" loop></audio>
    </div>
  `;
  container.appendChild(toast);
  Toast.getOrCreateInstance(toast).show();

  const ringTone = document.getElementById("ringtone") as HTMLAudioElement;
  if (ringTone) ringTone.play();
}

// -----------------------------------------------------------------------------
function delNotificationCall(msgId: string) {
  try {
    const toast = document.getElementById(`msg-${msgId}`);
    if (toast) toast.remove();
  } catch {
    // do nothing
  }
}

// -----------------------------------------------------------------------------
async function watchCall(msgId: string) {
  try {
    // this will fail if the call message is already deleted
    const msg = await getById("/api/pri/intercom/get", msgId);
    const expiredAt = new Date(msg.expired_at);
    if (isOver(expiredAt)) throw new Error("expired call");
    if (msg.status !== "seen") throw new Error("invalid status");

    setTimeout(() => {
      watchCall(msgId);
    }, 2000);
  } catch {
    delNotificationCall(msgId);
  }
}

// -----------------------------------------------------------------------------
async function callHandler(msg: IntercomMessage) {
  try {
    // set as seen
    await actionById("/api/pri/intercom/set/seen", msg.id);

    addNotificationCall(msg);
    watchCall(msg.id);
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
