import { list } from "$lib/api";

// -----------------------------------------------------------------------------
export const AUTH_TYPE_OPTIONS = [
  ["none", "anonymous"],
  ["token", "token"],
];

// -----------------------------------------------------------------------------
export async function domainsAsOptions() {
  const options: string[][] = [];

  const priDomains = await list("/api/pri/domain/list");
  for (const p of priDomains) {
    options.push([p.id, p.disabled ? `${p.name} (disabled)` : p.name]);
  }

  const pubDomains = await list("/api/pub/domain/list/enabled");
  for (const p of pubDomains) {
    options.push([p.id, p.name]);
  }

  return options;
}
