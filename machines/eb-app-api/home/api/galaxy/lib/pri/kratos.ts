import { KRATOS_ORIGIN } from "../../config.ts";

// -----------------------------------------------------------------------------
export async function getIdentityId(req: Request): Promise<string | undefined> {
  const cookie = req.headers.get("cookie");
  if (!cookie) return undefined;
  if (!cookie.match("csrf_token")) return undefined;
  if (!cookie.match("ory_kratos_session")) return undefined;

  try {
    const whoami = `${KRATOS_ORIGIN}/sessions/whoami`;
    const res = await fetch(whoami, {
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Cookie": `${cookie}`,
      },
      mode: "cors",
    });
    const identityId = res.headers.get("x-kratos-authenticated-identity-id");

    if (!identityId) throw new Error("no identity");

    return identityId;
  } catch {
    return undefined;
  }
}
