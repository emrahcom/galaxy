import { getById, listByValue } from "$lib/api";
import { isOver } from "$lib/common";
import type { IntercomMessage222 } from "$lib/types";

// -----------------------------------------------------------------------------
export function updateMessageList() {
  const messages: IntercomMessage222[] = [];

  for (const key in globalThis.localStorage) {
    try {
      if (!key.match("^msg-")) continue;

      const value = globalThis.localStorage.getItem(key);
      if (!value) throw "empty message";

      const parsedValue = JSON.parse(value) as IntercomMessage222;
      messages.push(parsedValue);
    } catch {
      globalThis.localStorage.removeItem(key);
    }
  }

  // Call and phone messages are always before the text messages.
  // The text messages should be ordered according to their creation times.
  const sortedMessages = [...messages].sort((a, b) => {
    let dateA = Number(a.microsec_created_at) || 0;
    let dateB = Number(b.microsec_created_at) || 0;

    // Use the time of 8 hours earlier for non-text messages to show them before
    // the text messages.
    if (a.message_type !== "text") dateA = dateA - 8 * 3600 * 1000000;
    if (b.message_type !== "text") dateB = dateB - 8 * 3600 * 1000000;

    if (dateA > dateB) return -1;
    else if (dateA < dateB) return 1;
    else return 0;
  });

  // Show only the first 5 messages.
  // Phone and direct calls have always higher priority.
  return sortedMessages.slice(-5);
}

// -----------------------------------------------------------------------------
// The last message time will be used as the starting poing in the next request.
// -----------------------------------------------------------------------------
function setLastMessageTime(msg: IntercomMessage222) {
  try {
    const last = globalThis.localStorage.getItem("intercom_last_msg_at");

    if (isNaN(Number(last)) || msg.microsec_created_at > Number(last)) {
      globalThis.localStorage.setItem(
        "intercom_last_msg_at",
        String(msg.microsec_created_at),
      );
    }
  } catch {
    // do nothing
  }
}

// -----------------------------------------------------------------------------
// Add the message object to the local storage.
// -----------------------------------------------------------------------------
function addMessage(msg: IntercomMessage222) {
  try {
    const isExist = globalThis.localStorage.getItem(`msg-${msg.id}`);
    if (isExist) return;

    globalThis.localStorage.setItem(`msg-${msg.id}`, JSON.stringify(msg));
    document.dispatchEvent(new CustomEvent("internalMessage"));
  } catch {
    // do nothing
  }
}

// -----------------------------------------------------------------------------
// Remove the message object from the local storage.
// -----------------------------------------------------------------------------
export function delMessage(msgId: string) {
  try {
    globalThis.localStorage.removeItem(`msg-${msgId}`);
    document.dispatchEvent(new CustomEvent("internalMessage"));
  } catch {
    // do nothing
  }
}

// -----------------------------------------------------------------------------
// Watching will happen inside the popup when the message becomes visible.
// No watching for unvisible messages.
// -----------------------------------------------------------------------------
export async function watchMessage(msgId: string, interval = 2000) {
  try {
    // This will fail if the message is already deleted.
    const msg = await getById("/api/pri/intercom/get", msgId);
    if (msg.status !== "none") throw "invalid status";

    const expiredAt = new Date(msg.expired_at);
    if (isOver(expiredAt)) throw "expired message";

    setTimeout(() => {
      watchMessage(msgId, interval);
    }, interval);
  } catch {
    delMessage(msgId);
  }
}

// -----------------------------------------------------------------------------
// Watching will happen inside the popup when the message becomes visible.
// No watching for unvisible messages. There is a ramp up in text message
// watching.
// -----------------------------------------------------------------------------
export async function watchTextMessage(msgId: string, interval = 2000) {
  try {
    // This will fail if the message is already deleted.
    const msg = await getById("/api/pri/intercom/get", msgId);
    if (msg.status !== "none") throw "invalid status";

    const expiredAt = new Date(msg.expired_at);
    if (isOver(expiredAt)) throw "expired message";

    const nextInterval = 2 * interval > 600000 ? 600000 : 2 * interval;

    setTimeout(() => {
      watchTextMessage(msgId, nextInterval);
    }, nextInterval);
  } catch {
    delMessage(msgId);
  }
}

// -----------------------------------------------------------------------------
// Trigger a select query on the server side (postgres), /api/pri/intercom/list
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

      const messages: IntercomMessage222[] = await listByValue(
        "/api/pri/intercom/list",
        globalThis.localStorage.getItem("intercom_last_msg_at") || "0",
      );

      for (const msg of messages) {
        setLastMessageTime(msg);

        if (
          msg.message_type === "text" ||
          msg.message_type === "call" ||
          msg.message_type === "phone"
        ) {
          addMessage(msg);
        }
      }
    }
  } finally {
    setTimeout(intercomHandler, 3000);
  }
}
