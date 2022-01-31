import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import { listEnabledPublicDomain } from "../database/domain.ts";

const PRE = "/api/pub/domain";

// -----------------------------------------------------------------------------
async function listEnabled(req: Request): Promise<unknown> {
  const pl = await req.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listEnabledPublicDomain(limit, offset);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/list/enabled`) {
    return await wrapper(listEnabled, req);
  } else {
    return notFound();
  }
}
