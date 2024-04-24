import {
  generateGuestTokenHS,
  generateGuestTokenJaas,
  generateHostTokenHS,
  generateHostTokenJaas,
} from "./token.ts";
import type {
  MeetingLinkset,
  Profile,
  RoomLinkset,
} from "../database/types.ts";

// -----------------------------------------------------------------------------
async function generateRoomUrlJaas(
  linkset: RoomLinkset,
  profile: Profile,
  exp = 3600,
): Promise<string> {
  const sub = encodeURIComponent(linkset.domain_attr.jaas_app_id);
  let url = encodeURI(linkset.domain_attr.jaas_url);
  let roomName = encodeURIComponent(linkset.name);

  if (linkset.has_suffix) roomName = `${roomName}-${linkset.suffix}`;
  url = `${url}/${sub}/${roomName}`;

  const jwt = await generateHostTokenJaas(
    linkset.domain_attr.jaas_app_id,
    linkset.domain_attr.jaas_kid,
    linkset.domain_attr.jaas_key,
    linkset.domain_attr.jaas_alg,
    linkset.domain_attr.jaas_aud,
    linkset.domain_attr.jaas_iss,
    roomName,
    profile.name,
    profile.email,
    exp,
  );

  return `${url}?jwt=${jwt}`;
}

// -----------------------------------------------------------------------------
async function generateRoomUrlToken(
  linkset: RoomLinkset,
  profile: Profile,
  exp = 3600,
): Promise<string> {
  let url = encodeURI(linkset.domain_attr.url);
  let roomName = encodeURIComponent(linkset.name);

  if (linkset.has_suffix) roomName = `${roomName}-${linkset.suffix}`;
  url = `${url}/${roomName}`;

  const jwt = await generateHostTokenHS(
    linkset.domain_attr.app_id,
    linkset.domain_attr.app_secret,
    linkset.domain_attr.app_alg,
    roomName,
    profile.name,
    profile.email,
    exp,
  );

  return `${url}?jwt=${jwt}`;
}

// -----------------------------------------------------------------------------
export async function generateRoomUrl(
  linkset: RoomLinkset,
  profile: Profile,
  exp = 3600,
): Promise<string> {
  let url: string;

  if (!profile.name) profile.name = "";
  if (!profile.email) profile.email = "";

  if (linkset.auth_type === "jaas") {
    url = await generateRoomUrlJaas(linkset, profile, exp);
  } else if (linkset.auth_type === "token") {
    url = await generateRoomUrlToken(linkset, profile, exp);
  } else {
    let roomName = encodeURIComponent(linkset.name);

    url = encodeURI(linkset.domain_attr.url);
    if (linkset.has_suffix) roomName = `${roomName}-${linkset.suffix}`;
    url = `${url}/${roomName}`;
  }

  // Exception for meet.jit.si, it doesn't support fragments correctly.
  // So, use only the link without any fragment.
  if (linkset.domain_attr.url === "https://meet.jit.si") return url;

  const subject = encodeURIComponent(`"${linkset.name}"`);
  const displayName = encodeURIComponent(`"${profile.name}"`);
  const email = encodeURIComponent(`"${profile.email}"`);

  url = `${url}#config.localSubject=${subject}`;
  if (profile.name) url = `${url}&userInfo.displayName=${displayName}`;
  if (profile.email) url = `${url}&userInfo.email=${email}`;

  return url;
}

// -----------------------------------------------------------------------------
async function generateMeetingUrlJaasHost(
  linkset: MeetingLinkset,
  exp = 3600,
): Promise<string> {
  const sub = encodeURIComponent(linkset.domain_attr.jaas_app_id);
  let url = encodeURI(linkset.domain_attr.jaas_url);
  let roomName = encodeURIComponent(linkset.room_name);

  if (linkset.has_suffix) roomName = `${roomName}-${linkset.suffix}`;
  url = `${url}/${sub}/${roomName}`;

  const jwt = await generateHostTokenJaas(
    linkset.domain_attr.jaas_app_id,
    linkset.domain_attr.jaas_kid,
    linkset.domain_attr.jaas_key,
    linkset.domain_attr.jaas_alg,
    linkset.domain_attr.jaas_aud,
    linkset.domain_attr.jaas_iss,
    roomName,
    linkset.profile_name,
    linkset.profile_email,
    exp,
  );

  return `${url}?jwt=${jwt}`;
}

// -----------------------------------------------------------------------------
async function generateMeetingUrlJaasGuest(
  linkset: MeetingLinkset,
  exp = 3600,
): Promise<string> {
  const sub = encodeURIComponent(linkset.domain_attr.jaas_app_id);
  let url = encodeURI(linkset.domain_attr.jaas_url);
  let roomName = encodeURIComponent(linkset.room_name);

  if (linkset.has_suffix) roomName = `${roomName}-${linkset.suffix}`;
  url = `${url}/${sub}/${roomName}`;

  const jwt = await generateGuestTokenJaas(
    linkset.domain_attr.jaas_app_id,
    linkset.domain_attr.jaas_kid,
    linkset.domain_attr.jaas_key,
    linkset.domain_attr.jaas_alg,
    linkset.domain_attr.jaas_aud,
    linkset.domain_attr.jaas_iss,
    roomName,
    linkset.profile_name,
    linkset.profile_email,
    exp,
  );

  return `${url}?jwt=${jwt}`;
}

// -----------------------------------------------------------------------------
async function generateMeetingUrlTokenHost(
  linkset: MeetingLinkset,
  exp = 3600,
): Promise<string> {
  let url = encodeURI(linkset.domain_attr.url);
  let roomName = encodeURIComponent(linkset.room_name);

  if (linkset.has_suffix) roomName = `${roomName}-${linkset.suffix}`;
  url = `${url}/${roomName}`;

  const jwt = await generateHostTokenHS(
    linkset.domain_attr.app_id,
    linkset.domain_attr.app_secret,
    linkset.domain_attr.app_alg,
    roomName,
    linkset.profile_name,
    linkset.profile_email,
    exp,
  );

  return `${url}?jwt=${jwt}`;
}

// -----------------------------------------------------------------------------
async function generateMeetingUrlTokenGuest(
  linkset: MeetingLinkset,
  exp = 3600,
): Promise<string> {
  let url = encodeURI(linkset.domain_attr.url);
  let roomName = encodeURIComponent(linkset.room_name);

  if (linkset.has_suffix) roomName = `${roomName}-${linkset.suffix}`;
  url = `${url}/${roomName}`;

  const jwt = await generateGuestTokenHS(
    linkset.domain_attr.app_id,
    linkset.domain_attr.app_secret,
    linkset.domain_attr.app_alg,
    roomName,
    linkset.profile_name,
    linkset.profile_email,
    exp,
  );

  return `${url}?jwt=${jwt}`;
}

// -----------------------------------------------------------------------------
export async function generateMeetingUrl(
  linkset: MeetingLinkset,
  exp = 3600,
): Promise<string> {
  let url: string;

  if (!linkset.profile_name) linkset.profile_name = "";
  if (!linkset.profile_email) linkset.profile_email = "";

  if (linkset.auth_type === "jaas" && linkset.join_as === "host") {
    url = await generateMeetingUrlJaasHost(linkset, exp);
  } else if (linkset.auth_type === "jaas") {
    url = await generateMeetingUrlJaasGuest(linkset, exp);
  } else if (linkset.auth_type === "token" && linkset.join_as === "host") {
    url = await generateMeetingUrlTokenHost(linkset, exp);
  } else if (linkset.auth_type === "token") {
    url = await generateMeetingUrlTokenGuest(linkset, exp);
  } else {
    let roomName = encodeURIComponent(linkset.room_name);

    url = encodeURI(linkset.domain_attr.url);
    if (linkset.has_suffix) roomName = `${roomName}-${linkset.suffix}`;
    url = `${url}/${roomName}`;
  }

  // Exception for meet.jit.si, it doesn't support fragments correctly.
  // So, use only the link without any fragment.
  if (linkset.domain_attr.url === "https://meet.jit.si") return url;

  let subject: string;
  if (linkset.schedule_name) {
    subject = encodeURIComponent(`"${linkset.schedule_name}, ${linkset.name}"`);
  } else {
    subject = encodeURIComponent(`"${linkset.name}"`);
  }

  const displayName = encodeURIComponent(`"${linkset.profile_name}"`);
  const email = encodeURIComponent(`"${linkset.profile_email}"`);

  url = `${url}#config.localSubject=${subject}`;
  if (linkset.profile_name) url = `${url}&userInfo.displayName=${displayName}`;
  if (linkset.profile_email) url = `${url}&userInfo.email=${email}`;

  return url;
}
