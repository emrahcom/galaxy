import { ok } from "../common/http-response.ts";

// -----------------------------------------------------------------------------
export default async function (req: Deno.RequestEvent) {
  const body = {
    text: "hello admin",
  };

  await ok(req, JSON.stringify(body));
}
