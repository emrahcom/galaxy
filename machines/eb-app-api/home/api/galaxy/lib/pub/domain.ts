import { notFound, responsePub } from "../http/response.ts";
import { getLimit, getOffset } from "../database/common.ts";
import { listEnabledPublicDomain } from "../database/domain.ts";

const PRE = "/api/pub/domain";

// -----------------------------------------------------------------------------
async function listEnabled(req: Deno.RequestEvent) {
  const pl = await req.request.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listEnabledPublicDomain(limit, offset);
}

// -----------------------------------------------------------------------------
export default function (req: Deno.RequestEvent, path: string) {
  if (path === `${PRE}/list/enabled`) {
    responsePub(listEnabled, req);
  } else {
    notFound(req);
  }
}
