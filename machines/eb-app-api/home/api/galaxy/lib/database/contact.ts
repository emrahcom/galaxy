import { fetch, pool } from "./common.ts";
import { addCall, addCallByKey } from "./intercom-call.ts";
import { getDomainByKeyIfAllowed, getDomainIfAllowed } from "./domain.ts";
import { getRandomRoomName, getRoomUrl, getRoomUrlByKey } from "./room.ts";
import type {
  Contact,
  ContactStatus,
  Id,
  IntercomCall,
  RoomLinkset,
} from "./types.ts";

// Expire second for the direct call URL (if it is a domain with token auth).
const EXP = 3600;

// The additional hashes for the direct call URL.
let HASH = "";
HASH += "&config.prejoinConfig.enabled=false";
HASH += "&config.startWithVideoMuted=true";

// -----------------------------------------------------------------------------
export async function getContact(identityId: string, contactId: string) {
  const sql = {
    text: `
      SELECT co.id, co.name, pr.name as profile_name, pr.email as profile_email,
        co.created_at, co.updated_at,
        floor(extract(epoch FROM now() - i.seen_at)) as seen_second_ago
      FROM contact co
        JOIN identity i ON co.remote_id = i.id
        LEFT JOIN profile pr ON co.remote_id = pr.identity_id
                                AND pr.is_default
      WHERE co.id = $2
        AND co.identity_id = $1`,
    args: [
      identityId,
      contactId,
    ],
  };

  return await fetch(sql) as Contact[];
}

// -----------------------------------------------------------------------------
export async function getContactByIdentity(
  identityId: string,
  remoteId: string,
) {
  const sql = {
    text: `
      SELECT co.id, co.name, pr.name as profile_name, pr.email as profile_email,
        co.created_at, co.updated_at,
        floor(extract(epoch FROM now() - i.seen_at)) as seen_second_ago
      FROM contact co
        JOIN identity i ON co.remote_id = i.id
        LEFT JOIN profile pr ON co.remote_id = pr.identity_id
                                AND pr.is_default
      WHERE co.identity_id = $1
        AND co.remote_id = $2`,
    args: [
      identityId,
      remoteId,
    ],
  };

  return await fetch(sql) as Contact[];
}

// -----------------------------------------------------------------------------
export async function getContactIdentity(
  identityId: string,
  contactId: string,
) {
  const sql = {
    text: `
      SELECT remote_id as Id, created_at
      FROM contact
      WHERE id = $2
        AND identity_id = $1`,
    args: [
      identityId,
      contactId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function getContactIdentityByKey(
  keyValue: string,
  contactId: string,
) {
  const sql = {
    text: `
      SELECT remote_id as Id, created_at
      FROM contact
      WHERE id = $2
        AND identity_id = (SELECT identity_id
                           FROM identity_key
                           WHERE value = $1
                             AND enabled
                          )`,
    args: [
      keyValue,
      contactId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function listContact(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT co.id, co.name, pr.name as profile_name, pr.email as profile_email,
        co.created_at, co.updated_at,
        floor(extract(epoch FROM now() - i.seen_at)) as seen_second_ago
      FROM contact co
        JOIN identity i ON co.remote_id = i.id
        LEFT JOIN profile pr ON co.remote_id = pr.identity_id
                                AND pr.is_default
      WHERE co.identity_id = $1
      ORDER BY name, profile_name, profile_email
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Contact[];
}

// -----------------------------------------------------------------------------
// Consumer is the user with an identity key.
// -----------------------------------------------------------------------------
export async function listContactByKey(
  keyValue: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT co.id, co.name, pr.name as profile_name, pr.email as profile_email,
        co.created_at, co.updated_at,
        floor(extract(epoch FROM now() - i.seen_at)) as seen_second_ago
      FROM contact co
        JOIN identity i ON co.remote_id = i.id
        LEFT JOIN profile pr ON co.remote_id = pr.identity_id
                                AND pr.is_default
      WHERE co.identity_id = (SELECT identity_id
                              FROM identity_key
                              WHERE value = $1
                                AND enabled
                             )
      ORDER BY name, profile_name, profile_email
      LIMIT $2 OFFSET $3`,
    args: [
      keyValue,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Contact[];
}

// -----------------------------------------------------------------------------
export async function listContactByDomain(
  identityId: string,
  domainId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT co.id, co.name, pr.name as profile_name, pr.email as profile_email,
        co.created_at, co.updated_at,
        floor(extract(epoch FROM now() - i.seen_at)) as seen_second_ago
      FROM contact co
        JOIN identity i ON co.remote_id = i.id
        LEFT JOIN profile pr ON co.remote_id = pr.identity_id
                                AND pr.is_default
      WHERE co.identity_id = $1
        AND NOT EXISTS (SELECT 1
                        FROM domain_partner
                        WHERE identity_id = co.remote_id
                          AND domain_id = $2
                       )
        AND NOT EXISTS (SELECT 1
                        FROM domain_partner_candidate
                        WHERE identity_id = co.remote_id
                          AND domain_id = $2
                       )
      ORDER BY name, profile_name, profile_email
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      domainId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Contact[];
}

// -----------------------------------------------------------------------------
export async function listContactByRoom(
  identityId: string,
  roomId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT co.id, co.name, pr.name as profile_name, pr.email as profile_email,
        co.created_at, co.updated_at,
        floor(extract(epoch FROM now() - i.seen_at)) as seen_second_ago
      FROM contact co
        JOIN identity i ON co.remote_id = i.id
        LEFT JOIN profile pr ON co.remote_id = pr.identity_id
                                AND pr.is_default
      WHERE co.identity_id = $1
        AND NOT EXISTS (SELECT 1
                        FROM room_partner
                        WHERE identity_id = co.remote_id
                          AND room_id = $2
                       )
        AND NOT EXISTS (SELECT 1
                        FROM room_partner_candidate
                        WHERE identity_id = co.remote_id
                          AND room_id = $2
                       )
      ORDER BY name, profile_name, profile_email
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      roomId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Contact[];
}

// -----------------------------------------------------------------------------
export async function listContactByMeeting(
  identityId: string,
  meetingId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT co.id, co.name, pr.name as profile_name, pr.email as profile_email,
        co.created_at, co.updated_at,
        floor(extract(epoch FROM now() - i.seen_at)) as seen_second_ago
      FROM contact co
        JOIN identity i ON co.remote_id = i.id
        LEFT JOIN profile pr ON co.remote_id = pr.identity_id
                                AND pr.is_default
      WHERE co.identity_id = $1
        AND NOT EXISTS (SELECT 1
                        FROM meeting_member
                        WHERE identity_id = co.remote_id
                          AND meeting_id = $2
                       )
        AND NOT EXISTS (SELECT 1
                        FROM meeting_member_candidate
                        WHERE identity_id = co.remote_id
                          AND meeting_id = $2
                       )
      ORDER BY name, profile_name, profile_email
      LIMIT $3 OFFSET $4`,
    args: [
      identityId,
      meetingId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Contact[];
}

// -----------------------------------------------------------------------------
export async function listContactStatus(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT co.id,
        floor(extract(epoch FROM now() - seen_at)) as seen_second_ago
      FROM contact co
        JOIN identity i ON co.remote_id = i.id
      WHERE co.identity_id = $1
      ORDER BY i.seen_at DESC
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as ContactStatus[];
}

// -----------------------------------------------------------------------------
export async function delContact(identityId: string, contactId: string) {
  using client = await pool.connect();
  const trans = client.createTransaction("transaction");
  await trans.begin();

  // Before deleting the contact, delete the contact owner from the contact's
  // contact list.
  // If the owner added herself as a contact (identity_id = remote_id), dont
  // delete this record here to allow the main SQL to get the deleted Id because
  // there is only one record (not a pair) in this case.
  const sql0 = {
    text: `
      DELETE FROM contact
      WHERE identity_id = (SELECT remote_id
                           FROM contact
                           WHERE id = $2
                          )
        AND identity_id != remote_id
        AND remote_id = $1`,
    args: [
      identityId,
      contactId,
    ],
  };
  await trans.queryObject(sql0);

  const sql = {
    text: `
      DELETE FROM contact
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      contactId,
    ],
  };
  const { rows: rows } = await trans.queryObject(sql);

  await trans.commit();

  return rows as Id[];
}

// -----------------------------------------------------------------------------
export async function updateContact(
  identityId: string,
  contactId: string,
  name: string,
) {
  const sql = {
    text: `
      UPDATE contact
      SET
        name = $3,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      contactId,
      name,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function callContact(
  identityId: string,
  contactId: string,
  domainId: string,
) {
  // Get the domain if allowed.
  const domains = await getDomainIfAllowed(identityId, domainId);
  const domain = domains[0];
  if (!domain) throw "domain is not available";

  // Get the contact identity.
  const contacts = await getContactIdentity(identityId, contactId);
  const contact = contacts[0];
  if (!contact) throw "contact is not available";
  const remoteId = contact.id;

  // Get the room (with a random name and suffix) for the direct call.
  const randomRooms = await getRandomRoomName("call-");
  const randomRoom = randomRooms[0];
  if (!randomRoom) throw "no room for the call";

  // The linkset for the call.
  const roomLinkset = {
    name: randomRoom.name,
    has_suffix: true,
    suffix: randomRoom.suffix,
    auth_type: domain.auth_type,
    domain_attr: domain.domain_attr,
  } as RoomLinkset;

  // Get the meeting link for caller.
  const callerUrl = await getRoomUrl(
    identityId,
    roomLinkset,
    "host",
    EXP,
    HASH,
  );
  // Get the meeting link for the callee.
  const calleeUrl = await getRoomUrl(remoteId, roomLinkset, "guest", EXP, HASH);
  const callAttr = { url: calleeUrl };

  // Create the intercom message to initialize the direct call.
  const calls = await addCall(identityId, remoteId, callAttr);
  const call = calls[0];
  if (!call) throw "call cannot be created";

  return [{ id: call.id, url: callerUrl }] as IntercomCall[];
}

// -----------------------------------------------------------------------------
export async function callContactByKey(keyValue: string, contactId: string) {
  // Get the domain by identity key if allowed.
  const domains = await getDomainByKeyIfAllowed(keyValue);
  const domain = domains[0];
  if (!domain) throw "domain is not available";

  // Get the contact identity by identity key.
  const contacts = await getContactIdentityByKey(keyValue, contactId);
  const contact = contacts[0];
  if (!contact) throw "contact is not available";
  const remoteId = contact.id;

  // Get the room (with a random name and suffix) for the direct call.
  const randomRooms = await getRandomRoomName("call-");
  const randomRoom = randomRooms[0];
  if (!randomRoom) throw "no room for the call";

  // The linkset for the call.
  const roomLinkset = {
    name: randomRoom.name,
    has_suffix: true,
    suffix: randomRoom.suffix,
    auth_type: domain.auth_type,
    domain_attr: domain.domain_attr,
  } as RoomLinkset;

  // Get the meeting link for caller.
  const callerUrl = await getRoomUrlByKey(
    keyValue,
    roomLinkset,
    "host",
    EXP,
    HASH,
  );
  // Get the meeting link for the callee.
  const calleeUrl = await getRoomUrl(remoteId, roomLinkset, "guest", EXP, HASH);
  const callAttr = { url: calleeUrl };

  // Create the intercom message to initialize the direct call.
  const calls = await addCallByKey(keyValue, remoteId, callAttr);
  const call = calls[0];
  if (!call) throw "call cannot be created";

  return [{ id: call.id, url: callerUrl }] as IntercomCall[];
}
