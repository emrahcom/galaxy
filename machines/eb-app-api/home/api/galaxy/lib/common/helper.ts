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
  let url = encodeURI(room.auth_attr.url);
  let roomName = encodeURIComponent(room.name);

  if (room.has_suffix) roomName = `${roomName}-${room.suffix}`;

  url = `${url}/${roomName}`;

  if (room.auth_type === "token") {
    const jwt = await generateHostToken(
      room.auth_attr.app_id,
      room.auth_attr.app_secret,
      roomName,
      profile.name,
      profile.email,
      exp,
    );

    url = `${url}?jwt=${jwt}`;
  }

  const displayName = encodeURIComponent(`"${profile.name}"`);
  const email = encodeURIComponent(`"${profile.email}"`);
  const subject = encodeURIComponent(`"${room.name}"`);

  url = `${url}#userInfo.displayName=${displayName}`;
  url = `${url}&userInfo.email=${email}`;
  url = `${url}&config.subject=${subject}`;

  return url;
}

// -----------------------------------------------------------------------------
export async function generateMeetingUrl(
  meeting: MeetingLinkSet,
  exp = 86400,
): Promise<string> {
  let url = encodeURI(meeting.auth_attr.url);
  let roomName = encodeURIComponent(meeting.room_name);

  if (meeting.has_suffix) roomName = `${roomName}-${meeting.suffix}`;

  url = `${url}/${roomName}`;

  if (meeting.auth_type === "token") {
    const jwt = await generateHostToken(
      meeting.auth_attr.app_id,
      meeting.auth_attr.app_secret,
      roomName,
      meeting.profile_name,
      meeting.profile_email,
      exp,
    );

    url = `${url}?jwt=${jwt}`;
  }

  const displayName = encodeURIComponent(`"${meeting.profile_name}"`);
  const email = encodeURIComponent(`"${meeting.profile_email}"`);
  const subject = encodeURIComponent(`"${meeting.name}"`);

  url = `${url}#userInfo.displayName=${displayName}`;
  url = `${url}&userInfo.email=${email}`;
  url = `${url}&config.subject=${subject}`;

  return url;
}
