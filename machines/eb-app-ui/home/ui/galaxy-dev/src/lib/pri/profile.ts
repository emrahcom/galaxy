import { post } from "$lib/http";

// -----------------------------------------------------------------------------
export async function get(uuid: string) {
  const url = "/api/pri/profile/get";
  const payload = {
    id: uuid,
  };
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const profiles = await res.json();

  if (!profiles[0]) throw new Error("no result");

  return profiles[0];
}

// -----------------------------------------------------------------------------
export async function list() {
  const url = "/api/pri/profile/list";
  const payload = {};
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const profiles = await res.json();

  return profiles;
}

// -----------------------------------------------------------------------------
export async function add(payload: unknown) {
  const url = "/api/pri/profile/add";
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const profiles = await res.json();

  if (!profiles[0]) throw new Error("no result");

  return profiles[0];
}

// -----------------------------------------------------------------------------
export async function update(payload: unknown) {
  const url = "/api/pri/profile/update";
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const profiles = await res.json();

  if (!profiles[0]) throw new Error("no result");

  return profiles[0];
}
