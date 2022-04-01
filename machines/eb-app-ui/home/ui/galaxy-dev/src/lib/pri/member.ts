import { getById } from "$lib/api";

// -----------------------------------------------------------------------------
export async function join(uuid: string) {
  const link = await getById("/api/pri/meeting/get/link", uuid);

  if (!link.url) throw new Error("URL not found");

  window.location.replace(link.url);
}
