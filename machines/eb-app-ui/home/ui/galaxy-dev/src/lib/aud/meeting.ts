import { getById } from "$lib/api";

// -----------------------------------------------------------------------------
export const SCHEDULE_TYPE_OPTIONS = [
  ["ephemeral", "ephemeral"],
  ["permanent", "permanent"],
  ["scheduled", "scheduled"],
];

// -----------------------------------------------------------------------------
export const SCHEDULE_TYPE_OPTIONS_2 = [
  ["permanent", "permanent"],
  ["scheduled", "scheduled"],
];

// -----------------------------------------------------------------------------
export async function join(uuid: string) {
  const link = await getById("/api/pri/meeting/get/link", uuid);

  if (!link.url) throw new Error("URL not found");

  window.location.replace(link.url);
}
