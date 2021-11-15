import { ok } from "../common/http-response.ts";

// -----------------------------------------------------------------------------
export default async function (req: Deno.RequestEvent, identityId: string) {
  const body = {
    text: `hello ${identityId}`,
  };

  await ok(req, JSON.stringify(body));
}
