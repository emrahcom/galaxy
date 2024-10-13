import { getById, list } from "$lib/api";
import { isOver } from "$lib/common";
import type { IntercomMessage } from "$lib/types";

// -----------------------------------------------------------------------------
export function updateMessageList() {
  const list: IntercomMessage[] = [];

  for (const key in globalThis.localStorage) {
    try {
      if (!key.match("^msg-")) continue;

      const value = globalThis.localStorage.getItem(key);
      if (!value) throw "empty message";

      const parsedValue = JSON.parse(value) as IntercomMessage;
      list.push(parsedValue);
    } catch {
      globalThis.localStorage.removeItem(key);
    }
  }

  return list;
}

// -----------------------------------------------------------------------------
export async function watchCall(msgId: string) {
  try {
    // this will fail if the call message is already deleted
    const msg = await getById("/api/pri/intercom/get", msgId);
    if (msg.status !== "none") throw "invalid status";

    const expiredAt = new Date(msg.expired_at);
    if (isOver(expiredAt)) throw "expired call";

    setTimeout(() => {
      watchCall(msgId);
    }, 2000);
  } catch {
    delCallMessage(msgId);
  }
}

// -----------------------------------------------------------------------------
function addCallMessage(msg: IntercomMessage) {
  try {
    // set as seen
    //await actionById("/api/pri/intercom/set/seen", msg.id);

    const isExist = globalThis.localStorage.getItem(`msg-${msg.id}`);
    if (isExist) return;

    globalThis.localStorage.setItem(`msg-${msg.id}`, JSON.stringify(msg));
    document.dispatchEvent(new CustomEvent("internalMessage"));
  } catch {
    // do nothing
  }
}

// -----------------------------------------------------------------------------
function delCallMessage(msgId: string) {
  try {
    globalThis.localStorage.removeItem(`msg-${msgId}`);
    document.dispatchEvent(new CustomEvent("internalMessage"));
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
          addCallMessage(msg);
        }
      }
    }
  } finally {
    setTimeout(intercomHandler, 3000);
  }
}
