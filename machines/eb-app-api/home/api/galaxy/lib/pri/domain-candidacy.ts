import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import {
  getDomainCandidacy,
  listDomainCandidacyByDomain,
} from "../database/domain-candidacy.ts";

const PRE = "/api/pri/domain/candidacy";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const candidacyId = pl.id;

  return await getDomainCandidacy(identityId, candidacyId);
}

// -----------------------------------------------------------------------------
async function listByDomain(
  req: Request,
  identityId: string,
): Promise<unknown> {
  const pl = await req.json();
  const domainId = pl.domain_id;

  return await listDomainCandidacyByDomain(identityId, domain_id);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get`) {
    return await wrapper(get, req, identityId);
  } else if (path === `${PRE}/list/bydomain`) {
    return await wrapper(listByDomain, req, identityId);
  } else {
    return notFound();
  }
}
