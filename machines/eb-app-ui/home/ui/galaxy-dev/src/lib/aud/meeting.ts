import { getByCode } from "$lib/api";

// -----------------------------------------------------------------------------
export async function join(code: string) {
  const link = await getByCode("/api/pub/meeting/get/link/bycode", code);

  if (!link.url) throw "URL not found";

  globalThis.location.replace(link.url);
}
