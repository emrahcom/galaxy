import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { ringCall, updatePresence } from "../database/intercom.ts";

const PRE = "/api/pri/intercom";

// -----------------------------------------------------------------------------
async function ping(_req: Request, identityId: string): Promise<unknown> {
  return await updatePresence(identityId);
}

// -----------------------------------------------------------------------------
async function ring(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const intercomId = pl.id;

  return await ringCall(identityId, intercomId);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/ping`) {
    return await wrapper(ping, req, identityId);
  } else if (path === `${PRE}/call/ring`) {
    return await wrapper(ring, req, identityId);
  } else {
    return notFound();
  }
}
