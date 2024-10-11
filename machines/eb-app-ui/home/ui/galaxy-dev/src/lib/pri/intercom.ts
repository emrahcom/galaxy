//import { Toast } from "bootstrap";
import { actionById, getById, list } from "$lib/api";
import { isOver } from "$lib/common";
import type { IntercomMessage } from "$lib/types";

// -----------------------------------------------------------------------------
export function updateNotificationList() {
  const list: IntercomMessage[] = [];

  try {
    for (const key in globalThis.localStorage) {
      if (!key.match("^msg-")) continue;

      const value = globalThis.localStorage.getItem(key);
      if (!value) continue;

      list.push(JSON.parse(value) as IntercomMessage);
    }
  } catch {
    // do nothing
  }

  return list;
}

// -----------------------------------------------------------------------------
//function createCallToast(msg: IntercomMessage) {
//  const oldToast = document.getElementById(`msg-${msg.id}`);
//  if (oldToast) oldToast.remove();
//
//  const toast = document.createElement("div");
//  toast.id = `msg-${msg.id}`;
//  toast.setAttribute("class", "toast");
//  toast.setAttribute("role", "alert");
//  toast.setAttribute("aria-live", "assertive");
//  toast.setAttribute("aria-atomic", "true");
//  toast.setAttribute("data-bs-autohide", "false");
//  toast.innerHTML = `
//    <div class="toast-body">
//      <div class="d-flex">
//        <i class="bi bi-telephone text-primary fs-5 me-3"></i>
//        <span class="fs-6 fw-bold me-2 mt-auto mb-1">${msg.contact_name}</span>
//        <span class="fs-6 me-auto mt-auto mb-1">is calling...</span>
//        <button
//          type="button"
//          class="btn-close"
//          data-bs-dismiss="toast"
//          aria-label="Close"
//          onclick="document.getElementById('msg-${msg.id}')?.remove()"
//        ></button>
//      </div>
//      <div class="d-flex justify-content-center">
//        <button
//          class="btn btn-sm m-2 mb-0 btn-danger"
//          type="button"
//        >Reject</button>
//        <button
//          class="btn btn-sm m-2 mb-0 btn-success"
//          type="button"
//        >Accept</button>
//        <audio id="ring-${msg.id}" src="/ringing.mp3" loop></audio>
//      </div>
//    </div>
//  `;
//
//  return toast;
//}

// -----------------------------------------------------------------------------
function addCallNotification(msg: IntercomMessage) {
  //const container = document.getElementById("notifications");
  //if (!container) return;

  //const toast = createCallToast(msg);
  //container.appendChild(toast);
  //Toast.getOrCreateInstance(toast).show();

  //const ring = document.getElementById(`ring-${msg.id}`) as HTMLAudioElement;
  //if (ring) ring.play();

  try {
    globalThis.localStorage.setItem(`msg-${msg.id}`, JSON.stringify(msg));
    document.dispatchEvent(new CustomEvent("internalMessage"));
  } catch {
    // do nothing
  }
}

// -----------------------------------------------------------------------------
function delCallNotification(msgId: string) {
  try {
    //const toast = document.getElementById(`msg-${msgId}`);
    //if (toast) toast.remove();

    globalThis.localStorage.removeItem(`msg-${msgId}`);
    document.dispatchEvent(new CustomEvent("internalMessage"));
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
    delCallNotification(msgId);
  }
}

// -----------------------------------------------------------------------------
async function callHandler(msg: IntercomMessage) {
  try {
    // set as seen
    await actionById("/api/pri/intercom/set/seen", msg.id);

    addCallNotification(msg);
    watchCall(msg.id);
  } catch {
    // do nothing
  }
}

// -----------------------------------------------------------------------------
export async function intercomHandler() {
  try {
    const now = new Date().getTime();
    const checkedAt =
      globalThis.localStorage.getItem("intercom_checked_at") || "0";

    if (isNaN(Number(checkedAt))) {
      globalThis.localStorage.setItem("intercom_checked_at", String(now));
    }

    if (now - Number(checkedAt) > 3000) {
      globalThis.localStorage.setItem("intercom_checked_at", String(now));

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
