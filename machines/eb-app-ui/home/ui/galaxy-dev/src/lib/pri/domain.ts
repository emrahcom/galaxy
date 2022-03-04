import { post } from "$lib/http";

export const AUTH_TYPE_OPTIONS = [
  ["none", "anonymous"],
  ["token", "token"],
];

// -----------------------------------------------------------------------------
export async function get(uuid: string) {
  const url = "/api/pri/domain/get";
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
  const url = "/api/pri/domain/list";
  const payload = {};
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const profiles = await res.json();

  return profiles;
}

// -----------------------------------------------------------------------------
export async function add(payload: unknown) {
  const url = "/api/pri/domain/add";
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const profiles = await res.json();

  if (!profiles[0]) throw new Error("no result");

  return profiles[0];
}

// -----------------------------------------------------------------------------
export async function del(uuid: string) {
  const url = "/api/pri/domain/del";
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
export async function update(payload: unknown) {
  const url = "/api/pri/domain/update";
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const profiles = await res.json();

  if (!profiles[0]) throw new Error("no result");

  return profiles[0];
}

// -----------------------------------------------------------------------------
export async function enable(uuid: string) {
  const url = "/api/pri/domain/enable";
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
export async function disable(uuid: string) {
  const url = "/api/pri/domain/disable";
  const payload = {
    id: uuid,
  };
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const profiles = await res.json();

  if (!profiles[0]) throw new Error("no result");

  return profiles[0];
}
