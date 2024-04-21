import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import { listSessionByMonth } from "../database/calendar.ts";

const PRE = "/api/pri/calendar";

// -----------------------------------------------------------------------------
async function listByMonth(
  req: Request,
  identityId: string,
): Promise<unknown> {
  const pl = await req.json();
  const date = pl.value;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listSessionByMonth(identityId, date, limit, offset);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/list/bymonth`) {
    return await wrapper(listByMonth, req, identityId);
  } else {
    return notFound();
  }
}
