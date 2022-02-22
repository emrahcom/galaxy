import { post } from "$lib/http";

// -----------------------------------------------------------------------------
export async function listDomain() {
  const url = "/api/pri/domain/list";
  const payload = {};
  const res = await post(url, payload);

  if (res.status !== 200) {
    throw new Error("could not get domain list");
  }
  const domains = await res.json();

  return domains;
}
