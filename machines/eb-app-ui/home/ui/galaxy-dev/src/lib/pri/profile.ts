import { post } from "$lib/http";

// -----------------------------------------------------------------------------
export async function listProfiles() {
  const url = "/api/pri/profile/list";
  const payload = {};
  const res = await post(url, payload);

  if (res.status !== 200) {
    throw new Error("post failed");
  }
  const profiles = await res.json();

  return profiles;
}
