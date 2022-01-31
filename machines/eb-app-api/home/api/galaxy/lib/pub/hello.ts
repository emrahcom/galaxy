import { ok } from "../http/response.ts";

// -----------------------------------------------------------------------------
export default function (): Response {
  const body = {
    text: "hello public",
  };

  return ok(JSON.stringify(body));
}
