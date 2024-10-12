import { getById } from "$lib/api";

// -----------------------------------------------------------------------------
export async function join(uuid: string) {
  const link = await getById("/api/pri/room/get/link", uuid);

  if (!link.url) throw "URL not found";

  globalThis.location.replace(link.url);
}
