import { post } from "$lib/http";

// -----------------------------------------------------------------------------
export async function action(url: string, payload: unknown) {
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const rows = await res.json();

  if (!rows[0]) throw new Error("no result");

  return rows[0];
}

// -----------------------------------------------------------------------------
export async function actionById(url: string, id: string) {
  const payload = {
    id: id,
  };

  return await action(url, payload);
}

// -----------------------------------------------------------------------------
export async function get(url: string, id: string) {
  const payload = {
    id: id,
  };

  return await action(url, payload);
}

// -----------------------------------------------------------------------------
export async function list(url: string, limit = 10, offset = 0) {
  const payload = {
    limit: limit,
    offset: offset,
  };
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const rows = await res.json();

  return rows;
}

// -----------------------------------------------------------------------------
export async function domainsAsOptions() {
  let options: string[][];

  const priDomains = await list("/api/pri/domain/list");
  for (const p of priDomains) {
    options.push([p.id, p.name]);
  }

  const pubDomains = await list("/api/pub/domain/list/enabled");
  for await (const p of pubDomains) {
    options.push([p.id, p.name]);
  }

  return options;
}
