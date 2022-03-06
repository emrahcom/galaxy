import { get } from "$lib/api";

// -----------------------------------------------------------------------------
export async function connect(roomId: string) {
  const room = get("/api/pri/room/get", roomId);
  const domain = get("/api/pri/domain/get", room.domain_id);
  const profile = get("/api/pri/profile/get/default");
}
