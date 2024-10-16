import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  addContactInvite,
  delContactInvite,
  getContactInvite,
  getContactInviteByCode,
  listContactInvite,
  updateContactInviteEnabled,
} from "../database/contact-invite.ts";

const PRE = "/api/pri/contact/invite";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await getContactInvite(identityId, inviteId);
}

// -----------------------------------------------------------------------------
async function getByCode(req: Request, _identityId: string): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await getContactInviteByCode(code);
}

// -----------------------------------------------------------------------------
async function list(
  req: Request,
  identityId: string,
): Promise<unknown> {
  const pl = await req.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listContactInvite(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
async function add(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const name = pl.name;
  const disposable = pl.disposable;

  return await addContactInvite(identityId, name, disposable);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await delContactInvite(identityId, inviteId);
}

// -----------------------------------------------------------------------------
async function enable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await updateContactInviteEnabled(identityId, inviteId, true);
}

// -----------------------------------------------------------------------------
async function disable(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const inviteId = pl.id;

  return await updateContactInviteEnabled(identityId, inviteId, false);
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
  } else if (path === `${PRE}/list`) {
    return await wrapper(list, req, identityId);
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
