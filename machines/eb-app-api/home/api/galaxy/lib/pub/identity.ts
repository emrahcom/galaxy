import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import { updatePresenceByKey } from "../database/identity.ts";

const PRE = "/api/pub/identity";

// -----------------------------------------------------------------------------
async function pingByKey(req: Request): Promise<unknown> {
  const pl = await req.json();
  const keyValue = pl.key_value;

  return await updatePresenceByKey(keyValue);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/ping/bykey`) {
    return await wrapper(pingByKey, req);
  } else {
    return notFound();
  }
}
