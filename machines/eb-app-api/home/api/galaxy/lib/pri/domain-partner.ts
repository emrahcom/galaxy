import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  delDomainPartner,
  getDomainPartner,
  listDomainPartnerByDomain,
  updateDomainPartnerEnabled,
} from "../database/domain-partner.ts";

const PRE = "/api/pri/domain/partner";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const partnershipId = pl.id;

  return await getDomainPartner(identityId, partnershipId);
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

  return await listDomainPartnerByDomain(identityId, domainId, limit, offset);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const partnershipId = pl.id;

  return await delDomainPartner(identityId, partnershipId);
}

// -----------------------------------------------------------------------------
async function enable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const partnershipId = pl.id;

  return await updateDomainPartnerEnabled(identityId, partnershipId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const partnershipId = pl.id;

  return await updateDomainPartnerEnabled(identityId, partnershipId, false);
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
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else if (path === `${PRE}/enable`) {
    return await wrapper(enable, req, identityId);
  } else if (path === `${PRE}/disable`) {
    return await wrapper(disable, req, identityId);
  } else {
    return notFound();
  }
}
