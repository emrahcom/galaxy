import { post } from "$lib/http";

// -----------------------------------------------------------------------------
export async function get(uuid: string) {
  const url = "/api/pri/profile/get";
  const payload = {
    id: uuid,
  };
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const rows = await res.json();

  if (!rows[0]) throw new Error("no result");

  return rows[0];
}

// -----------------------------------------------------------------------------
export async function list() {
  const url = "/api/pri/profile/list";
  const payload = {};
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const rows = await res.json();

  return rows;
}

// -----------------------------------------------------------------------------
export async function add(payload: unknown) {
  const url = "/api/pri/profile/add";
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const rows = await res.json();

  if (!rows[0]) throw new Error("no result");

  return rows[0];
}

// -----------------------------------------------------------------------------
export async function del(uuid: string) {
  const url = "/api/pri/profile/del";
  const payload = {
    id: uuid,
  };
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const rows = await res.json();

  if (!rows[0]) throw new Error("no result");

  return rows[0];
}

// -----------------------------------------------------------------------------
export async function update(payload: unknown) {
  const url = "/api/pri/profile/update";
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const rows = await res.json();

  if (!rows[0]) throw new Error("no result");

  return rows[0];
}

// -----------------------------------------------------------------------------
export async function setDefault(uuid: string) {
  const url = "/api/pri/profile/set/default";
  const payload = {
    id: uuid,
  };
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const rows = await res.json();

  if (!rows[0]) throw new Error("no result");

  return rows[0];
}
