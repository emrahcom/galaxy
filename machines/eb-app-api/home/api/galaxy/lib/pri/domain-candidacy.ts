import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import {
  getDomainCandidacy,
  listDomainCandidacy,
} from "../database/domain-candidacy.ts";

const PRE = "/api/pri/domain/candidacy";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const candidacyId = pl.id;

  return await getDomainCandidacy(identityId, candidacyId);
}

// -----------------------------------------------------------------------------
async function list(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listDomainCandidacy(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get`) {
    return await wrapper(get, req, identityId);
  } else if (path === `${PRE}/list`) {
    return await wrapper(list, req, identityId);
  } else {
    return notFound();
  }
}
