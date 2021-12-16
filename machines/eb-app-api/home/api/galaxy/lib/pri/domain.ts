import { notFound, responsePri } from "../http/response.ts";
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
  const domainName = pl.name;
  const domainAuthType = pl.auth_type;
  const domainAuthAttr = pl.auth_attr;

  return await addDomain(
    identityId,
    domainName,
    domainAuthType,
    domainAuthAttr,
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
  const domainName = pl.name;
  const domainAuthType = pl.auth_type;
  const domainAuthAttr = pl.auth_attr;

  return await updateDomain(
    identityId,
    domainId,
    domainName,
    domainAuthType,
    domainAuthAttr,
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
    responsePri(get, req, identityId);
  } else if (path === `${PRE}/list`) {
    responsePri(list, req, identityId);
  } else if (path === `${PRE}/add`) {
    responsePri(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    responsePri(del, req, identityId);
  } else if (path === `${PRE}/update`) {
    responsePri(update, req, identityId);
  } else if (path === `${PRE}/enable`) {
    responsePri(enable, req, identityId);
  } else if (path === `${PRE}/disable`) {
    responsePri(disable, req, identityId);
  } else {
    notFound(req);
  }
}
