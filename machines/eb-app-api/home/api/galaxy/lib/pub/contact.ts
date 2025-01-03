import { getLimit, getOffset } from "../database/common.ts";
import { notFound } from "../http/response.ts";
import { pub as wrapper } from "../http/wrapper.ts";
import { listContactByCode } from "../database/contact.ts";

const PRE = "/api/pub/contact";

// -----------------------------------------------------------------------------
async function list(req: Request): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listContactByCode(code, limit, offset);
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/list`) {
    return await wrapper(list, req);
  } else {
    return notFound();
  }
}
