import { ok } from "../common/http-response.ts";

// -----------------------------------------------------------------------------
export default function (req: Deno.RequestEvent) {
  const body = {
    text: "hello public",
  };

  ok(req, JSON.stringify(body));
}
