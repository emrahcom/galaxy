import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import { updatePresenceByCode } from "../database/identity.ts";

const PRE = "/api/pub/identity";

// -----------------------------------------------------------------------------
async function ping(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await updatePresenceByCode(code);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/ping`) {
    return await wrapper(ping, req);
  } else {
    return notFound();
  }
}
