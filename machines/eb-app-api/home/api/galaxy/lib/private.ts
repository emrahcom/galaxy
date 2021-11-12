import { KRATOS } from "../config.ts";

// -----------------------------------------------------------------------------
export async function getIdentity(req: Deno.RequestEvent) {
  const whoami = `${KRATOS}/sessions/whoami`;
  const cookie = req.request.headers.get("cookie") || "";
  const res = await fetch(whoami, {
    credentials: "include",
    headers: {
      "Accept": "application/json",
      "Cookie": `${cookie}`,
    },
    mode: "cors",
  });

  return res.headers.get("x-kratos-authenticated-identity-id");
}

// -----------------------------------------------------------------------------
export function hello(req: Deno.RequestEvent, identityId: string) {
  req.respondWith(
    new Response(`hello ${identityId}`, {
      status: 200,
    }),
  );
}
