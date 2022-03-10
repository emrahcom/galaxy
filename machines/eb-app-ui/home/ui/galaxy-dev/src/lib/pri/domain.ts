import { list } from "$lib/api";

// -----------------------------------------------------------------------------
export const AUTH_TYPE_OPTIONS = [
  ["none", "anonymous"],
  ["token", "token"],
];

// -----------------------------------------------------------------------------
export async function domainsAsOptions() {
  interface Option {
    id: string;
    name: string;
    enabled: boolean;
  }

  const options: Option[] = [];

  const priDomains = await list("/api/pri/domain/list");
  for (const p of priDomains) {
    options.push({
      id: p.id,
      name: p.name,
      enabled: p.enabled,
    });
  }

  const pubDomains = await list("/api/pub/domain/list/enabled");
  for (const p of pubDomains) {
    options.push({
      id: p.id,
      name: p.name,
      enabled: true,
    });
  }

  return options;
}
