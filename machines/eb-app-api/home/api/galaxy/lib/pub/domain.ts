import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import { listPublicDomain } from "../database/domain.ts";

const PRE = "/api/pub/domain";

// -----------------------------------------------------------------------------
async function list(req: Request): Promise<unknown> {
  const pl = await req.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listPublicDomain(limit, offset);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/list`) {
    return await wrapper(list, req);
  } else {
    return notFound();
  }
}
