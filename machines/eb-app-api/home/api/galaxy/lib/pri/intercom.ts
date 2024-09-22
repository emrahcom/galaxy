import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { updatePresence } from "../database/intercom.ts";

const PRE = "/api/pri/intercom";

// -----------------------------------------------------------------------------
async function ping(_req: Request, identityId: string): Promise<unknown> {
  return await updatePresence(identityId);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/ping`) {
    return await wrapper(ping, req, identityId);
  } else {
    return notFound();
  }
}
