import { ok } from "../http/response.ts";

// -----------------------------------------------------------------------------
export default function (identityId: string): Response {
  const body = {
    text: `hello ${identityId}`,
  };

  return ok(JSON.stringify(body));
}
