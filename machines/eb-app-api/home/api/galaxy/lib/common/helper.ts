import { createHostToken } from "./token.ts";
import type { Profile, RoomLink } from "../database/types.ts";

// -----------------------------------------------------------------------------
export async function createLink(
  room: RoomLink,
  profile: Profile,
  exp = 86400,
): string {
  let link = room.auth_attr.url;
  let roomName = room.name;

  if (room.has_suffix) roomName = `${roomName}-${room.suffix}`;

  link = `${link}/${roomName}`;

  if (room.auth_type === "token") {
    const jwt = await createHostToken(
      room.auth_attr.app_id,
      room.auth_attr.appsecret,
      roomName,
      profile.name,
      profile.email,
      exp,
    );

    link = `${link}?jwt=${jwt}`;
  }

  link = `${link}#userInfo.displayName="${profile.name}"`;
  link = `${link}&userInfo.email="${profile.email}"`;

  return link;
}
