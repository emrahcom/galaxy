import { generateGuestToken, generateHostToken } from "./token.ts";
import type {
  MeetingLinkset,
  Profile,
  RoomLinkset,
} from "../database/types.ts";

// -----------------------------------------------------------------------------
export async function generateRoomUrl(
  linkset: RoomLinkset,
  profile: Profile,
  exp = 3600,
): Promise<string> {
  if (!profile.name) profile.name = "";
  if (!profile.email) profile.email = "";

  let url = encodeURI(linkset.domain_attr.url);
  let roomName = encodeURIComponent(linkset.name);

  if (linkset.has_suffix) roomName = `${roomName}-${linkset.suffix}`;

  url = `${url}/${roomName}`;

  if (linkset.auth_type === "token") {
    const jwt = await generateHostToken(
      linkset.domain_attr.app_id,
      linkset.domain_attr.app_secret,
      roomName,
      profile.name,
      profile.email,
      exp,
    );

    url = `${url}?jwt=${jwt}`;
  }

  const subject = encodeURIComponent(`"${linkset.name}"`);
  const displayName = encodeURIComponent(`"${profile.name}"`);
  const email = encodeURIComponent(`"${profile.email}"`);

  url = `${url}#config.subject=${subject}`;
  if (profile.name) url = `${url}&userInfo.displayName=${displayName}`;
  if (profile.email) url = `${url}&userInfo.email=${email}`;

  return url;
}

// -----------------------------------------------------------------------------
export async function generateMeetingUrl(
  linkset: MeetingLinkset,
  exp = 3600,
): Promise<string> {
  if (!linkset.profile_name) linkset.profile_name = "";
  if (!linkset.profile_email) linkset.profile_email = "";

  let url = encodeURI(linkset.domain_attr.url);
  let roomName = encodeURIComponent(linkset.room_name);

  if (linkset.has_suffix) roomName = `${roomName}-${linkset.suffix}`;

  url = `${url}/${roomName}`;

  if (linkset.auth_type === "token") {
    let jwt: string;

    if (linkset.join_as === "host") {
      jwt = await generateHostToken(
        linkset.domain_attr.app_id,
        linkset.domain_attr.app_secret,
        roomName,
        linkset.profile_name,
        linkset.profile_email,
        exp,
      );
    } else {
      jwt = await generateGuestToken(
        linkset.domain_attr.app_id,
        linkset.domain_attr.app_secret,
        roomName,
        linkset.profile_name,
        linkset.profile_email,
        exp,
      );
    }

    url = `${url}?jwt=${jwt}`;
  }

  let subject: string;
  if (linkset.schedule_name) {
    subject = encodeURIComponent(`"${linkset.schedule_name}, ${linkset.name}"`);
  } else {
    subject = encodeURIComponent(`"${linkset.name}"`);
  }

  const displayName = encodeURIComponent(`"${linkset.profile_name}"`);
  const email = encodeURIComponent(`"${linkset.profile_email}"`);

  url = `${url}#config.subject=${subject}`;
  if (linkset.profile_name) url = `${url}&userInfo.displayName=${displayName}`;
  if (linkset.profile_email) url = `${url}&userInfo.email=${email}`;

  return url;
}
