import { getById } from "$lib/api";

// -----------------------------------------------------------------------------
export const SCHEDULE_TYPE_OPTIONS = [
  ["ephemeral", "ephemeral"],
  ["permanent", "permanent"],
  ["scheduled", "scheduled"],
];

// -----------------------------------------------------------------------------
export async function join(uuid: string) {
  const link = await getById("/api/pri/meeting/get/link", uuid);
  window.location.replace(link.url);
}
