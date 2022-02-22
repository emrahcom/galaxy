export async function listDomain() {
  const url = "/api/pri/domain/list";
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Accept": "application/json",
    },
    mode: "cors",
    method: "post",
    body: JSON.stringify({}),
  });

  if (res.status !== 200) {
    throw new Error("could not get domain list");
  }
  const domains = await res.json();

  return domains;
}
