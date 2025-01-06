import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  addIdentityKey,
  delIdentityKey,
  getIdentityKey,
  listIdentityKey,
  updateIdentityKey,
  updateIdentityKeyEnabled,
} from "../database/identity-key.ts";

const PRE = "/api/pri/identity/key";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const keyId = pl.id;

  return await getIdentityKey(identityId, keyId);
}

// -----------------------------------------------------------------------------
async function list(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listIdentityKey(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
async function add(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const domainId = pl.domain_id;
  const name = pl.name;

  return await addIdentityKey(identityId, domainId, name);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const keyId = pl.id;

  return await delIdentityKey(identityId, keyId);
}

// -----------------------------------------------------------------------------
async function update(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const keyId = pl.id;
  const domainId = pl.domain_id;
  const name = pl.name;

  return await updateIdentityKey(identityId, keyId, domainId, name);
}

// -----------------------------------------------------------------------------
async function enable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const keyId = pl.id;

  return await updateIdentityKeyEnabled(identityId, keyId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const keyId = pl.id;

  return await updateIdentityKeyEnabled(identityId, keyId, false);
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
