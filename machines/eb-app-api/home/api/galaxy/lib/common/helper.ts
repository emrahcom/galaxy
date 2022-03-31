import { generateHostToken } from "./token.ts";
import type {
  MeetingLinkSet,
  Profile,
  RoomLinkSet,
} from "../database/types.ts";

// -----------------------------------------------------------------------------
export async function generateRoomUrl(
  room: RoomLinkSet,
  profile: Profile,
  exp = 86400,
): Promise<string> {
  if (!profile.name) profile.name = "";
  if (!profile.email) profile.email = "";

  let url = encodeURI(room.domain_attr.url);
  let roomName = encodeURIComponent(room.name);

  if (room.has_suffix) roomName = `${roomName}-${room.suffix}`;

  url = `${url}/${roomName}`;

  if (room.auth_type === "token") {
    const jwt = await generateHostToken(
      room.domain_attr.app_id,
      room.domain_attr.app_secret,
      roomName,
      profile.name,
      profile.email,
      exp,
    );

    url = `${url}?jwt=${jwt}`;
  }

  const subject = encodeURIComponent(`"${room.name}"`);
  const displayName = encodeURIComponent(`"${profile.name}"`);
  const email = encodeURIComponent(`"${profile.email}"`);

  url = `${url}#config.subject=${subject}`;
  if (profile.name) url = `${url}&userInfo.displayName=${displayName}`;
  if (profile.email) url = `${url}&userInfo.email=${email}`;

  return url;
}

// -----------------------------------------------------------------------------
export async function generateMeetingUrl(
  meeting: MeetingLinkSet,
  exp = 86400,
): Promise<string> {
  if (!meeting.profile_name) meeting.profile_name = "";
  if (!meeting.profile_email) meeting.profile_email = "";

  let url = encodeURI(meeting.domain_attr.url);
  let roomName = encodeURIComponent(meeting.room_name);

  if (meeting.has_suffix) roomName = `${roomName}-${meeting.suffix}`;

  url = `${url}/${roomName}`;

  if (meeting.auth_type === "token") {
    const jwt = await generateHostToken(
      meeting.domain_attr.app_id,
      meeting.domain_attr.app_secret,
      roomName,
      meeting.profile_name,
      meeting.profile_email,
      exp,
    );

    url = `${url}?jwt=${jwt}`;
  }

  let subject: string;
  if (meeting.schedule_name) {
    subject = encodeURIComponent(`"${meeting.schedule_name}, ${meeting.name}"`);
  } else {
    subject = encodeURIComponent(`"${meeting.name}"`);
  }

  const displayName = encodeURIComponent(`"${meeting.profile_name}"`);
  const email = encodeURIComponent(`"${meeting.profile_email}"`);

  url = `${url}#config.subject=${subject}`;
  if (meeting.profile_name) url = `${url}&userInfo.displayName=${displayName}`;
  if (meeting.profile_email) url = `${url}&userInfo.email=${email}`;

  return url;
}
