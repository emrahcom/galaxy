import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { addPartnership } from "../database/domain-partnership.ts";

const PRE = "/api/pri/domain/partnership";

// -----------------------------------------------------------------------------
async function add(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await addPartnership(identityId, code);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/add`) {
    return await wrapper(add, req, identityId);
  } else {
    return notFound();
  }
}
