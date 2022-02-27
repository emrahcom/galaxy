import { post } from "$lib/http";

// -----------------------------------------------------------------------------
export async function getProfile(uuid: string) {
  const url = "/api/pri/profile/get";
  const payload = {
    id: uuid,
  };
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const profiles = await res.json();

  if (!profiles[0]) throw new Error("not found");

  return profiles[0];
}

// -----------------------------------------------------------------------------
export async function listProfiles() {
  const url = "/api/pri/profile/list";
  const payload = {};
  const res = await post(url, payload);

  if (res.status !== 200) throw new Error("post failed");

  const profiles = await res.json();

  return profiles;
}
