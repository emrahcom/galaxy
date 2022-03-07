import { getById } from "$lib/api";

// -----------------------------------------------------------------------------
export async function connect(roomId: string) {
  const roomLink = await getById("/api/pri/room/get/link", roomId);
  window.location.replace(roomLink.link);
}
