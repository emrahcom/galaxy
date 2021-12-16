import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  addDomain,
  delDomain,
  getDomain,
  listDomain,
  updateDomain,
  updateDomainEnabled,
} from "../database/domain.ts";

const PRE = "/api/pri/domain";

// -----------------------------------------------------------------------------
async function get(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const domainId = pl.id;

  return await getDomain(identityId, domainId);
}

// -----------------------------------------------------------------------------
async function list(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listDomain(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
async function add(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const name = pl.name;
  const authType = pl.auth_type;
  const authAttr = pl.auth_attr;

  return await addDomain(
    identityId,
    name,
    authType,
    authAttr,
  );
}

// -----------------------------------------------------------------------------
async function del(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const domainId = pl.id;

  return await delDomain(identityId, domainId);
}

// -----------------------------------------------------------------------------
async function update(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const domainId = pl.id;
  const name = pl.name;
  const authType = pl.auth_type;
  const authAttr = pl.auth_attr;

  return await updateDomain(
    identityId,
    domainId,
    name,
    authType,
    authAttr,
  );
}

// -----------------------------------------------------------------------------
async function enable(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const domainId = pl.id;

  return await updateDomainEnabled(identityId, domainId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const domainId = pl.id;

  return await updateDomainEnabled(identityId, domainId, false);
}

// -----------------------------------------------------------------------------
export default function (
  req: Deno.RequestEvent,
  path: string,
  identityId: string,
) {
  if (path === `${PRE}/get`) {
    wrapper(get, req, identityId);
  } else if (path === `${PRE}/list`) {
    wrapper(list, req, identityId);
  } else if (path === `${PRE}/add`) {
    wrapper(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    wrapper(del, req, identityId);
  } else if (path === `${PRE}/update`) {
    wrapper(update, req, identityId);
  } else if (path === `${PRE}/enable`) {
    wrapper(enable, req, identityId);
  } else if (path === `${PRE}/disable`) {
    wrapper(disable, req, identityId);
  } else {
    notFound(req);
  }
}
