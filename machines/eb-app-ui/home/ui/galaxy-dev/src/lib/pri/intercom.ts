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

  const sortedMessages = [...messages].sort((a, b) => {
    const dateA = a.message_type === 'text' ? a.microsec_created_at || 0 : 0;
    const dateB = b.message_type === 'text' ? b.microsec_created_at || 0 : 0;

    if (dateA > dateB) return -1;
    else if (dateA < dateB) return 1;
    else return 0;
  });

  return sortedMessages;
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
// watchPhone is an alias for watchCall.
// Their logics are completely the same.
// -----------------------------------------------------------------------------
export const watchPhone = watchCall;

// -----------------------------------------------------------------------------
function setMessageTime(msg: IntercomMessage222) {
  try {
    const last = globalThis.localStorage.getItem("intercom_last_msg_at");

    if (isNaN(Number(last))) {
      globalThis.localStorage.setItem(
        "intercom_last_msg_at",
        String(msg.microsec_created_at),
      );
    } else if (msg.microsec_created_at > Number(last)) {
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
function addCallMessage(msg: IntercomMessage222) {
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
// addPhoneMessage is an alias for addCallMessage.
// Their logics are completely the same.
// -----------------------------------------------------------------------------
const addPhoneMessage = addCallMessage;

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
function addTextMessage(msg: IntercomMessage222) {
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
        setMessageTime(msg);

        if (msg.message_type === "call") {
          addCallMessage(msg);
        } else if (msg.message_type === "phone") {
          addPhoneMessage(msg);
        } else if (msg.message_type === "text") {
          addTextMessage(msg);
        }
      }
    }
  } finally {
    setTimeout(intercomHandler, 3000);
  }
}
