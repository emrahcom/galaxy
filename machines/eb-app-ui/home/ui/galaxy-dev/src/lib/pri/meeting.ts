import { getById } from "$lib/api";

// -----------------------------------------------------------------------------
export async function join(uuid: string) {
  const link = await getById("/api/pri/meeting/get/link", uuid);
  window.location.replace(link.url);
}
