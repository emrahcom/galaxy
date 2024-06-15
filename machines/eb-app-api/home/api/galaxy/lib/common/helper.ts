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

  const subject = encodeURIComponent(`"${linkset.name}"`);
  const displayName = encodeURIComponent(`"${profile.name}"`);
  const email = encodeURIComponent(`"${profile.email}"`);


  url = `${url}#galaxy=true`;
  if (linkset.domain_attr.url !== "https://meet.jit.si") {
    url = `${url}&config.localSubject=${subject}`;
  }
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

  let subject: string;
  if (linkset.schedule_name) {
    subject = encodeURIComponent(`"${linkset.schedule_name}, ${linkset.name}"`);
  } else {
    subject = encodeURIComponent(`"${linkset.name}"`);
  }

  const displayName = encodeURIComponent(`"${linkset.profile_name}"`);
  const email = encodeURIComponent(`"${linkset.profile_email}"`);

  url = `${url}#galaxy=true`;
  if (linkset.domain_attr.url !== "https://meet.jit.si") {
    url = `${url}&config.localSubject=${subject}`;
  }
  if (linkset.profile_name) url = `${url}&userInfo.displayName=${displayName}`;
  if (linkset.profile_email) url = `${url}&userInfo.email=${email}`;

  return url;
}

// -----------------------------------------------------------------------------
// return YYYY-MM-DD
// -----------------------------------------------------------------------------
export function getFirstDayOfMonth(date: string) {
  const _date = new Date(date);
  if (isNaN(_date.getTime())) throw new Error("invalid date");

  const diff = _date.getDate() - 1;
  const first = new Date(_date.getTime() - diff * 24 * 60 * 60 * 1000);

  return (
    first.getFullYear() +
    "-" +
    ("0" + (first.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + first.getDate()).slice(-2)
  );
}

// -----------------------------------------------------------------------------
// Sunday is assumed as the first day of the week.
// return YYYY-MM-DD
// -----------------------------------------------------------------------------
export function getFirstDayOfWeek(date: string) {
  const _date = new Date(date);
  if (isNaN(_date.getTime())) throw new Error("invalid date");

  const diff = _date.getDay();
  const sunday = new Date(_date.getTime() - diff * 24 * 60 * 60 * 1000);

  return (
    sunday.getFullYear() +
    "-" +
    ("0" + (sunday.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + sunday.getDate()).slice(-2)
  );
}

// -----------------------------------------------------------------------------
// return YYYY-MM-DD
// -----------------------------------------------------------------------------
export function dateAfterXDays(date: string, days: number) {
  const date0 = new Date(date);
  if (isNaN(date0.getTime())) throw new Error("invalid date");

  const date1 = new Date(date0.getTime() + days * 24 * 60 * 60 * 1000);
  if (isNaN(date1.getTime())) throw new Error("invalid date");

  return (
    date1.getFullYear() +
    "-" +
    ("0" + (date1.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date1.getDate()).slice(-2)
  );
}
