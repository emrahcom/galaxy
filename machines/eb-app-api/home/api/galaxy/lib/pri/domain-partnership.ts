import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import {
  addPartnershipByCode,
  delPartnership,
  getPartnershipByDomain,
} from "../database/domain-partnership.ts";

const PRE = "/api/pri/domain/partnership";

// -----------------------------------------------------------------------------
async function getByDomain(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const domainId = pl.id;

  return await getPartnershipByDomain(identityId, domainId);
}

// -----------------------------------------------------------------------------
async function addByCode(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await addPartnershipByCode(identityId, code);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const partnershipId = pl.id;

  return await delPartnership(identityId, partnershipId);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get/bydomain`) {
    return await wrapper(getByDomain, req, identityId);
  } else if (path === `${PRE}/add/bycode`) {
    return await wrapper(addByCode, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else {
    return notFound();
  }
}
