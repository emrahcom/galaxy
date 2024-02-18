export async function get(url: string) {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    mode: "cors",
  });

  return res;
}

// -----------------------------------------------------------------------------
export async function post(url: string, payload: unknown) {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
    mode: "cors",
    method: "post",
    body: JSON.stringify(payload),
  });

  return res;
}
