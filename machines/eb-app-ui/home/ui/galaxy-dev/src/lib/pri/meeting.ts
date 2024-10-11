import { getById } from "$lib/api";

// -----------------------------------------------------------------------------
export const SCHEDULE_TYPE_OPTIONS = [
  ["ephemeral", "ad hoc"],
  ["permanent", "permanent"],
  ["scheduled", "scheduled"],
];

// -----------------------------------------------------------------------------
export const SCHEDULE_TYPE_OPTIONS_2 = [
  ["permanent", "permanent"],
  ["scheduled", "scheduled"],
];

// -----------------------------------------------------------------------------
export async function joinAsOwner(uuid: string) {
  const link = await getById("/api/pri/meeting/get/link", uuid);

  if (!link.url) throw new Error("URL not found");

  globalThis.location.replace(link.url);
}

// -----------------------------------------------------------------------------
export async function joinAsMember(uuid: string) {
  const link = await getById("/api/pri/meeting/get/link/bymembership", uuid);

  if (!link.url) throw new Error("URL not found");

  globalThis.location.replace(link.url);
}
