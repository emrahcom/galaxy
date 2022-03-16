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
export async function get(url: string) {
  const payload = {};

  return await action(url, payload);
}

// -----------------------------------------------------------------------------
export async function getById(url: string, id: string) {
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
export async function listById(
  url: string,
  id: string,
  limit = 10,
  offset = 0,
) {
  const payload = {
    id: id,
    limit: limit,
    offset: offset,
  };
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const rows = await res.json();

  return rows;
}
