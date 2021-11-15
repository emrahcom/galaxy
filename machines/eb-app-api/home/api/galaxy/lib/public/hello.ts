import { ok } from "../common/http-response.ts";

// -----------------------------------------------------------------------------
export default async function (req: Deno.RequestEvent) {
  const body = {
    text: "hello public",
  };

  await ok(req, JSON.stringify(body));
}
