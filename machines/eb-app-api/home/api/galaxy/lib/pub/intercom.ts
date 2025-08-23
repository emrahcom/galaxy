import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import { mailMissedCall } from "../common/mail.ts";
import { getIdentityByKey } from "../database/identity.ts";
import {
  delIntercomByCode,
  delIntercomByKey,
  getIntercomAttrByCode,
  getIntercomByKey,
  getIntercomForOwner,
  listIntercomByKey,
  setStatusIntercomByKey,
} from "../database/intercom.ts";
import { ringCallByKey, ringPhoneByCode } from "../database/intercom-call.ts";

const PRE = "/api/pub/intercom";

// -----------------------------------------------------------------------------
async function getAttrByCode(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;
  const intercomId = pl.id;

  return await getIntercomAttrByCode(code, intercomId);
}

// -----------------------------------------------------------------------------
async function getByKey(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const intercomId = pl.id;

  return await getIntercomByKey(keyValue, intercomId);
}

// -----------------------------------------------------------------------------
async function listByKey(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const microsec = Number(pl.value) || 0;
  const limit = 10;
  const offset = 0;

  return await listIntercomByKey(keyValue, microsec, limit, offset);
}

// -----------------------------------------------------------------------------
async function setAcceptedByKey(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const intercomId = pl.id;

  return await setStatusIntercomByKey(keyValue, intercomId, "accepted");
}

// -----------------------------------------------------------------------------
async function setRejectedByKey(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const intercomId = pl.id;

  return await setStatusIntercomByKey(keyValue, intercomId, "rejected");
}

// -----------------------------------------------------------------------------
async function setSeenByKey(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const intercomId = pl.id;

  // The optional fourth argument is "ifNone".
  // Update as "seen" if the current status is "none". Otherwise, dont update.
  return await setStatusIntercomByKey(keyValue, intercomId, "seen", true);
}

// -----------------------------------------------------------------------------
async function delByCode(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;
  const intercomId = pl.id;

  return await delIntercomByCode(code, intercomId);
}

// -----------------------------------------------------------------------------
async function delByKey(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const intercomId = pl.id;

  return await delIntercomByKey(keyValue, intercomId);
}

// -----------------------------------------------------------------------------
async function delWithNotificationByKey(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const intercomId = pl.id;

  const identities = await getIdentityByKey(keyValue);
  const identity = identities[0];
  const identityId = identity.id;

  const intercomMessages = await getIntercomForOwner(identityId, intercomId);
  const intercomMessage = intercomMessages[0];

  if (intercomMessage?.remote_id) {
    // dont wait for the async function
    mailMissedCall(identityId, intercomMessage.remote_id);
  }

  return await delIntercomByKey(keyValue, intercomId);
}

// -----------------------------------------------------------------------------
async function ringByKey(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;
  const intercomId = pl.id;

  return await ringCallByKey(keyValue, intercomId);
}

// -----------------------------------------------------------------------------
async function ringByCode(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;
  const intercomId = pl.id;

  return await ringPhoneByCode(code, intercomId);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/get/attr/bycode`) {
    return await wrapper(getAttrByCode, req);
  } else if (path === `${PRE}/get/bykey`) {
    return await wrapper(getByKey, req);
  } else if (path === `${PRE}/list/bykey`) {
    return await wrapper(listByKey, req);
  } else if (path === `${PRE}/del/bycode`) {
    return await wrapper(delByCode, req);
  } else if (path === `${PRE}/del/bykey`) {
    return await wrapper(delByKey, req);
  } else if (path === `${PRE}/del-with-notification/bykey`) {
    return await wrapper(delWithNotificationByKey, req);
  } else if (path === `${PRE}/set/accepted/bykey`) {
    return await wrapper(setAcceptedByKey, req);
  } else if (path === `${PRE}/set/rejected/bykey`) {
    return await wrapper(setRejectedByKey, req);
  } else if (path === `${PRE}/set/seen/bykey`) {
    return await wrapper(setSeenByKey, req);
  } else if (path === `${PRE}/call/ring/bykey`) {
    return await wrapper(ringByKey, req);
  } else if (path === `${PRE}/phone/ring/bycode`) {
    return await wrapper(ringByCode, req);
  } else {
    return notFound();
  }
}
