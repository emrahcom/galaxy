import { createHostToken } from "./token.ts";
import type { Profile, RoomLink } from "../database/types.ts";

// -----------------------------------------------------------------------------
export async function createLink(
  room: RoomLink,
  profile: Profile,
  exp = 86400,
): Promise<string> {
  let link = encodeURI(room.auth_attr.url);
  let roomName = encodeURIComponent(room.name);

  if (room.has_suffix) roomName = `${roomName}-${room.suffix}`;

  link = `${link}/${roomName}`;

  if (room.auth_type === "token") {
    const jwt = await createHostToken(
      room.auth_attr.app_id,
      room.auth_attr.app_secret,
      roomName,
      profile.name,
      profile.email,
      exp,
    );

    link = `${link}?jwt=${jwt}`;
  }

  const displayName = encodeURIComponent(`"${profile.name}"`);
  const email = encodeURIComponent(`"${profile.email}"`);
  const subject = encodeURIComponent(`"${room.name}"`);

  link = `${link}#userInfo.displayName=${displayName}`;
  link = `${link}&userInfo.email=${email}`;
  link = `${link}&config.subject=${subject}`;

  return link;
}
