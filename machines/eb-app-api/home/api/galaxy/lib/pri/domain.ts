import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { isValidUrl } from "../common/validate.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  addDomain,
  delDomain,
  getDomain,
  listDomain,
  updateDomain,
  updateDomainEnabled,
} from "../database/domain.ts";
import type { Attr } from "../database/types.ts";

const PRE = "/api/pri/domain";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const domainId = pl.id;

  return await getDomain(identityId, domainId);
}

// -----------------------------------------------------------------------------
async function list(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listDomain(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
async function add(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const name = pl.name;
  const authType = pl.auth_type;
  const domainAttr = pl.domain_attr as Attr;

  if (authType === "jaas") {
    if (!isValidUrl(domainAttr.jaas_url)) throw new Error("invalid input");
  } else {
    if (!isValidUrl(domainAttr.url)) throw new Error("invalid input");
  }

  return await addDomain(
    identityId,
    name,
    authType,
    domainAttr,
  );
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const domainId = pl.id;

  return await delDomain(identityId, domainId);
}

// -----------------------------------------------------------------------------
async function update(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const domainId = pl.id;
  const name = pl.name;
  const authType = pl.auth_type;
  const domainAttr = pl.domain_attr as Attr;

  if (authType === "jaas") {
    if (!isValidUrl(domainAttr.jaas_url)) throw new Error("invalid input");
  } else {
    if (!isValidUrl(domainAttr.url)) throw new Error("invalid input");
  }

  return await updateDomain(
    identityId,
    domainId,
    name,
    authType,
    domainAttr,
  );
}

// -----------------------------------------------------------------------------
async function enable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const domainId = pl.id;

  return await updateDomainEnabled(identityId, domainId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const domainId = pl.id;

  return await updateDomainEnabled(identityId, domainId, false);
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
  } else if (path === `${PRE}/add`) {
    return await wrapper(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else if (path === `${PRE}/update`) {
    return await wrapper(update, req, identityId);
  } else if (path === `${PRE}/enable`) {
    return await wrapper(enable, req, identityId);
  } else if (path === `${PRE}/disable`) {
    return await wrapper(disable, req, identityId);
  } else {
    return notFound();
  }
}
