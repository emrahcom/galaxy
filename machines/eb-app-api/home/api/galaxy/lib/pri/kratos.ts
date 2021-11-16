import { KRATOS } from "../../config.ts";

// -----------------------------------------------------------------------------
export async function getIdentityId(req: Deno.RequestEvent) {
  const whoami = `${KRATOS}/sessions/whoami`;
  const cookie = req.request.headers.get("cookie") || "";

  try {
    const res = await fetch(whoami, {
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Cookie": `${cookie}`,
      },
      mode: "cors",
    });
    const identityId = res.headers.get("x-kratos-authenticated-identity-id");

    return `${identityId}`;
  } catch {
    return undefined;
  }
}
