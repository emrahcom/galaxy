import { fetch } from "./common.ts";
import { mailPhoneCall } from "../common/mail.ts";
import { generateRoomUrl } from "../common/helper.ts";
import { getRandomRoomName } from "./room.ts";
import { addPhoneCallByCode } from "../database/intercom-call.ts";
import type {
  Id,
  Phone,
  Phone111,
  Phone333,
  Profile,
  RoomLinkset,
} from "./types.ts";

// Expire second for the phone call URL (if it is a domain with token auth).
const EXP = 3600;

// The additional hashes for the phone call URL.
let HASH = "";
HASH += "&config.prejoinConfig.enabled=false";
HASH += "&config.startWithVideoMuted=true";

// -----------------------------------------------------------------------------
export async function getPhone(identityId: string, phoneId: string) {
  const sql = {
    text: `
      SELECT ph.id, ph.name, ph.code, d.id as domain_id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        d.enabled as domain_enabled,
        pr.id as profile_id, pr.name as profile_name, pr.email as profile_email,
        ph.email_enabled, ph.enabled, ph.created_at, ph.updated_at, ph.called_at
      FROM phone ph
        JOIN domain d ON ph.domain_id = d.id
        JOIN profile pr ON ph.profile_id = pr.id
      WHERE ph.id = $2
        AND ph.identity_id = $1`,
    args: [
      identityId,
      phoneId,
    ],
  };

  return await fetch(sql) as Phone[];
}

// -----------------------------------------------------------------------------
// Consumer is a public user with a public phone code.
// -----------------------------------------------------------------------------
export async function getPhoneByCode(code: string) {
  const sql = {
    text: `
      SELECT pr.name as profile_name, pr.email as profile_email, ph.code
      FROM phone ph
        JOIN identity i ON ph.identity_id = i.id
                           AND i.enabled
        JOIN domain d ON ph.domain_id = d.id
                         AND d.enabled
        JOIN profile pr ON ph.profile_id = pr.id
      WHERE ph.code = $1
        AND ph.enabled`,
    args: [
      code,
    ],
  };

  return await fetch(sql) as Phone111[];
}

// -----------------------------------------------------------------------------
// Consumer is internal.
// -----------------------------------------------------------------------------
export async function getPhonePrivatesByCode(code: string) {
  const sql = {
    text: `
      SELECT ph.id, ph.name, ph.identity_id as owner_id,
        pr.name as profile_name, pr.email as profile_email,
        d.auth_type, d.domain_attr
      FROM phone ph
        JOIN identity i ON ph.identity_id = i.id
                           AND i.enabled
        JOIN domain d ON ph.domain_id = d.id
                         AND d.enabled
        JOIN profile pr ON ph.profile_id = pr.id
      WHERE ph.code = $1
        AND ph.enabled`,
    args: [
      code,
    ],
  };

  return await fetch(sql) as Phone333[];
}

// -----------------------------------------------------------------------------
export async function listPhone(
  identityId: string,
  limit: number,
  offset: number,
) {
  const sql = {
    text: `
      SELECT ph.id, ph.name, ph.code, d.id as domain_id, d.name as domain_name,
        (CASE d.auth_type
           WHEN 'jaas' THEN d.domain_attr->>'jaas_url'
           ELSE d.domain_attr->>'url'
         END
        ) as domain_url,
        d.enabled as domain_enabled,
        pr.id as profile_id, pr.name as profile_name, pr.email as profile_email,
        ph.email_enabled, ph.enabled, ph.created_at, ph.updated_at, ph.called_at
      FROM phone ph
        JOIN domain d ON ph.domain_id = d.id
        JOIN profile pr ON ph.profile_id = pr.id
      WHERE ph.identity_id = $1
      ORDER BY name
      LIMIT $2 OFFSET $3`,
    args: [
      identityId,
      limit,
      offset,
    ],
  };

  return await fetch(sql) as Phone[];
}

// -----------------------------------------------------------------------------
export async function addPhone(
  identityId: string,
  profileId: string,
  domainId: string,
  name: string,
  emailEnabled: boolean,
) {
  const sql = {
    text: `
      INSERT INTO phone (identity_id, profile_id, domain_id, name,
        email_enabled)
      VALUES (
        $1,
        (SELECT id
         FROM profile
         WHERE id = $2
           AND identity_id = $1
        ),
        (SELECT id
         FROM domain d
         WHERE id = $3
           AND (identity_id = $1
                OR public
                OR EXISTS (SELECT 1
                           FROM domain_partner
                           WHERE identity_id = $1
                             AND domain_id = d.id
                          )
               )
        ),
        $4, $5
      )
      RETURNING id, created_at as at`,
    args: [
      identityId,
      profileId,
      domainId,
      name,
      emailEnabled,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function delPhone(identityId: string, phoneId: string) {
  const sql = {
    text: `
      DELETE FROM phone
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, now() as at`,
    args: [
      identityId,
      phoneId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updatePhone(
  identityId: string,
  phoneId: string,
  profileId: string,
  domainId: string,
  name: string,
  emailEnabled: boolean,
) {
  const sql = {
    text: `
      UPDATE phone
      SET
        profile_id = (SELECT id
                      FROM profile
                      WHERE id = $3
                        AND identity_id = $1
                     ),
        domain_id = (SELECT id
                     FROM domain d
                     WHERE id = $4
                       AND (identity_id = $1
                            OR public
                            OR EXISTS (SELECT 1
                                       FROM domain_partner
                                       WHERE identity_id = $1
                                         AND domain_id = d.id
                                      )
                           )
                    ),
        name = $5,
        email_enabled = $6,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      phoneId,
      profileId,
      domainId,
      name,
      emailEnabled,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
export async function updatePhoneEnabled(
  identityId: string,
  phoneId: string,
  value: boolean,
) {
  const sql = {
    text: `
      UPDATE phone
      SET
        enabled = $3,
        updated_at = now()
      WHERE id = $2
        AND identity_id = $1
      RETURNING id, updated_at as at`,
    args: [
      identityId,
      phoneId,
      value,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
// Consumer is internal and phoneId is found by using the phone code before.
// -----------------------------------------------------------------------------
async function increasePhoneCallCounter(phoneId: string) {
  const sql = {
    text: `
      UPDATE phone
      SET
        calls = calls + 1,
        called_at = now()
      WHERE id = $1
        AND enabled
      RETURNING id, called_at as at`,
    args: [
      phoneId,
    ],
  };

  return await fetch(sql) as Id[];
}

// -----------------------------------------------------------------------------
// Consumer is a public user with a public phone code.
// -----------------------------------------------------------------------------
export async function callPhoneByCode(code: string) {
  // It will not return a phone if there is a disabled component such as domain,
  // identity, etc.
  const phones = await getPhonePrivatesByCode(code);
  const phone = phones[0];
  if (!phone) throw "phone not found";

  // Increase the call counter.
  await increasePhoneCallCounter(phone.id);

  // Dont wait for this async function (mailer).
  mailPhoneCall(code, phone.name);

  const ownerProfile = {
    name: phone.profile_name,
    email: phone.profile_email,
  } as Profile;

  const calleeProfile = {
    name: "Guest",
    email: "",
  } as Profile;

  // Get the room (with a random name and suffix) for the phone call.
  const randomRooms = await getRandomRoomName("phone-");
  const randomRoom = randomRooms[0];
  if (!randomRoom) throw "no room for the phone call";

  // The linkset for the phone call.
  const roomLinkset = {
    name: randomRoom.name,
    has_suffix: true,
    suffix: randomRoom.suffix,
    auth_type: phone.auth_type,
    domain_attr: phone.domain_attr,
  } as RoomLinkset;

  // Get the meeting link for the owner.
  const ownerUrl = await generateRoomUrl(
    roomLinkset,
    ownerProfile,
    "host",
    EXP,
    HASH,
  );

  // Get the meeting link for the callee.
  const publicUrl = await generateRoomUrl(
    roomLinkset,
    calleeProfile,
    "guest",
    EXP,
    HASH,
  );

  // Public URL will be visible to the public user when the call is accepted by
  // the owner.
  const callAttr = {
    owner_url: ownerUrl,
    public_url: publicUrl,
    phone_name: phone.name,
  };

  return await addPhoneCallByCode(code, callAttr);
}
