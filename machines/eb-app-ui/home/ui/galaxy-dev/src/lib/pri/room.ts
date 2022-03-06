import { get, getById } from "$lib/api";
//import type { Domain, Profile, Room } from "$lib/types";

// -----------------------------------------------------------------------------
export async function connect(roomId: string) {
  const room = await getById("/api/pri/room/get", roomId);
  const domain = await getById("/api/pri/domain/get", room.domain_id);
  const profile = await get("/api/pri/profile/get/default");

  console.log(room);
  console.log(domain);
  console.log(profile);

  //room get link api call
}
