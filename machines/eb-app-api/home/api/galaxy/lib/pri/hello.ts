import { ok } from "../common/http-response.ts";

// -----------------------------------------------------------------------------
export default function (req: Deno.RequestEvent, identityId: string) {
  const body = {
    text: `hello ${identityId}`,
  };

  ok(req, JSON.stringify(body));
}
