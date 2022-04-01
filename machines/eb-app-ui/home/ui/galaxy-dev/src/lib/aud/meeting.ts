import { getByCode } from "$lib/api";

// -----------------------------------------------------------------------------
export async function join(code: string) {
  const link = await getByCode("/api/pub/meeting/get/link/bycode", code);

  if (!link.url) throw new Error("URL not found");

  window.location.replace(link.url);
}
