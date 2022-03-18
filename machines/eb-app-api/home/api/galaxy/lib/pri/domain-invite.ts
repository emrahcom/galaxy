import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  addDomainInvite,
  delDomainInvite,
  getDomainInvite,
  getDomainInviteByCode,
  listDomainInviteByDomain,
  updateDomainInviteEnabled,
} from "../database/domain-invite.ts";

const PRE = "/api/pri/domain/invite";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await getDomainInvite(identityId, inviteId);
}

// -----------------------------------------------------------------------------
async function getByCode(req: Request, _identityId: string): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await getDomainInviteByCode(code);
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

  return await listDomainInviteByDomain(identityId, domainId, limit, offset);
}

// -----------------------------------------------------------------------------
async function add(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const domainId = pl.domain_id;
  const name = pl.name;

  return await addDomainInvite(identityId, domainId, name);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await delDomainInvite(identityId, inviteId);
}

// -----------------------------------------------------------------------------
async function enable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await updateDomainInviteEnabled(identityId, inviteId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await updateDomainInviteEnabled(identityId, inviteId, false);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get`) {
    return await wrapper(get, req, identityId);
  } else if (path === `${PRE}/get/bycode`) {
    return await wrapper(getByCode, req, identityId);
  } else if (path === `${PRE}/list/bydomain`) {
    return await wrapper(listByDomain, req, identityId);
  } else if (path === `${PRE}/add`) {
    return await wrapper(add, req, identityId);
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
