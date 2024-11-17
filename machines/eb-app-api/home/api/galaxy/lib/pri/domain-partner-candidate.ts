import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import { mailToDomainPartnerCandidate } from "../common/mail.ts";
import {
  addDomainPartnerCandidate,
  delDomainPartnerCandidate,
  getDomainPartnerCandidate,
  listDomainPartnerCandidateByDomain,
} from "../database/domain-partner-candidate.ts";

const PRE = "/api/pri/domain/partner/candidate";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const candidacyId = pl.id;

  return await getDomainPartnerCandidate(identityId, candidacyId);
}

// -----------------------------------------------------------------------------
async function listByDomain(
  req: Request,
  identityId: string,
): Promise<unknown> {
  const pl = await req.json();
  const domainId = pl.id;
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listDomainPartnerCandidateByDomain(
    identityId,
    domainId,
    limit,
    offset,
  );
}

// -----------------------------------------------------------------------------
async function add(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const domainId = pl.domain_id;
  const contactId = pl.contact_id;

  const rows = await addDomainPartnerCandidate(identityId, domainId, contactId);

  const candidacyId = rows[0]?.id;
  if (candidacyId) {
    // dont wait for the mailer
    mailToDomainPartnerCandidate(identityId, contactId, candidacyId);
  }

  return rows;
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const candidacyId = pl.id;

  return await delDomainPartnerCandidate(identityId, candidacyId);
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
  } else if (path === `${PRE}/add`) {
    return await wrapper(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else {
    return notFound();
  }
}
