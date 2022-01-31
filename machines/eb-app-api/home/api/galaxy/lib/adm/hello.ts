import { ok } from "../http/response.ts";

// -----------------------------------------------------------------------------
export default function (): Response {
  const body = {
    text: "hello admin",
  };

  return ok(JSON.stringify(body));
}
