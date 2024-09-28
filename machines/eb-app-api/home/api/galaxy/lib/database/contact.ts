import { fetch, pool } from "./common.ts";
import { getDomainIfAllowed } from "./domain.ts";
import { getRoomUrl } from "./room.ts";
import type { Contact, Id, RoomLinkset } from "./types.ts";

// -----------------------------------------------------------------------------
export async function getContact(identityId: string, contactId: string) {
  const sql = {
    text: `
      SELECT co.id, co.name, pr.name as profile_name, pr.email as profile_email,
        co.created_at, co.updated_at
      FROM contact co
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
export async function listContact(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT co.id, co.name, pr.name as profile_name, pr.email as profile_email,
        co.created_at, co.updated_at
      FROM contact co
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
export async function listContactByDomain(
  identityId: string,
  domainId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT co.id, co.name, pr.name as profile_name, pr.email as profile_email,
        co.created_at, co.updated_at
      FROM contact co
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
        co.created_at, co.updated_at
      FROM contact co
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
        co.created_at, co.updated_at
      FROM contact co
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
export async function callContact(
  identityId: string,
  contactId: string,
  domainId: string,
) {
  // get the domain if allowed.
  const domains = await getDomainIfAllowed(identityId, domainId);
  const domain = domains[0];
  if (!domain) throw new Error("domain is not available");

  // check the existence of the contact and its accessibility
  const sql1 = {
    text: `
      SELECT remote_id as id
      FROM contact d
      WHERE id = $2
        AND identity_id = $1`,
    args: [
      identityId,
      contactId,
    ],
  };
  const contacts = await fetch(sql1) as Id[];
  const contact = contacts[0];
  if (!contact) throw new Error("contact is not available");
  const remoteId = contact.id;

  // generate the hashes of the call room using postgres functions
  const sql2 = {
    text: `
      SELECT
        'call-' || md5(gen_random_uuid()::text) as name,
        md5(gen_random_uuid()::text) as suffix`,
  };
  const rooms = await fetch(sql2) as Partial<RoomLinkset>[];
  const room = rooms[0];
  if (!room) throw new Error("error generating the room hashes");

  // the call room linkset
  const roomLinkset = {
    name: room.name,
    has_suffix: true,
    suffix: room.suffix,
    auth_type: domain.auth_type,
    domain_attr: domain.domain_attr,
  } as RoomLinkset;

  // get the meeting link for caller
  const callerUrl = await getRoomUrl(identityId, roomLinkset, "host");
  // get the meeting link for callee
  const calleeUrl = await getRoomUrl(remoteId, roomLinkset, "guest");

  console.log(callerUrl);
  console.log(calleeUrl);

  // create the intercom message to start the call

  return contacts;
}

// -----------------------------------------------------------------------------
export async function delContact(identityId: string, contactId: string) {
  using client = await pool.connect();
  const trans = client.createTransaction("transaction");
  await trans.begin();

  // before deleting the contact, delete the contact owner from the contact's
  // contact list.
  const sql0 = {
    text: `
      DELETE FROM contact
      WHERE remote_id = $1
        AND identity_id = (SELECT remote_id
                           FROM contact
                           WHERE id = $2
                          )`,
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
