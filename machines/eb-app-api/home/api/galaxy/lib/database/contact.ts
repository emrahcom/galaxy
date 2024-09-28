import { fetch, pool } from "./common.ts";
import { getRoomUrl } from "./room.ts";
import type { Contact, Domain, Id, RoomLinkset } from "./types.ts";

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
  // validate domain and its accessibility
  const sql0 = {
    text: `
      SELECT id, auth_type, domain_attr
      FROM domain d
      WHERE id = $2
        AND enabled = true
        AND (identity_id = $1
             OR public
             OR EXISTS (SELECT 1
                        FROM domain_partner
                        WHERE identity_id = $1
                          AND domain_id = d.id
                       )
            )`,
    args: [
      identityId,
      domainId,
    ],
  };
  const domains = await fetch(sql0) as Partial<Domain>[];
  if (!domains[0]) throw new Error("domain is not available");

  // validate contact
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

  // generate hashes using postgres functions
  const sql2 = {
    text: `
      SELECT 'call-' || md5(gen_random_uuid()::text) as name,
        md5(gen_random_uuid()::text) as suffix`,
  };
  const rooms = await fetch(sql2) as Partial<RoomLinkset>[];
  if (!rooms[0]) throw new Error("error generating hashes");

  // the call room linkset
  const roomLinkset = {
    name: rooms[0].name,
    has_suffix: true,
    suffix: rooms[0].suffix,
    auth_type: domains[0].auth_type,
    domain_attr: domains[0].domain_attr,
  } as RoomLinkset;

  // get the meeting link for caller
  const callerUrl = getRoomUrl(identityId, roomLinkset);
  // get the meeting link for callee
  const calleeUrl = getRoomUrl(remoteId, roomLinkset);

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
