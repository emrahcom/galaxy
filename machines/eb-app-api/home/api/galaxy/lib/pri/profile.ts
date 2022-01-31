import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import { getLimit, getOffset } from "../database/common.ts";
import {
  addProfile,
  delProfile,
  getDefaultProfile,
  getProfile,
  listProfile,
  setDefaultProfile,
  updateProfile,
} from "../database/profile.ts";

const PRE = "/api/pri/profile";

// -----------------------------------------------------------------------------
async function get(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const profileId = pl.id;

  return await getProfile(identityId, profileId);
}

// -----------------------------------------------------------------------------
async function getDefault(_req: Request, identityId: string): Promise<unknown> {
  return await getDefaultProfile(identityId);
}

// -----------------------------------------------------------------------------
async function list(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listProfile(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
async function add(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const name = pl.name;
  const email = pl.email;

  return await addProfile(identityId, name, email);
}

// -----------------------------------------------------------------------------
async function del(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const profileId = pl.id;

  return await delProfile(identityId, profileId);
}

// -----------------------------------------------------------------------------
async function update(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const profileId = pl.id;
  const name = pl.name;
  const email = pl.email;

  return await updateProfile(identityId, profileId, name, email);
}

// -----------------------------------------------------------------------------
async function setDefault(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const profileId = pl.id;

  return await setDefaultProfile(identityId, profileId);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/get`) {
    return await wrapper(get, req, identityId);
  } else if (path === `${PRE}/get/default`) {
    return await wrapper(getDefault, req, identityId);
  } else if (path === `${PRE}/list`) {
    return await wrapper(list, req, identityId);
  } else if (path === `${PRE}/add`) {
    return await wrapper(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    return await wrapper(del, req, identityId);
  } else if (path === `${PRE}/update`) {
    return await wrapper(update, req, identityId);
  } else if (path === `${PRE}/set/default`) {
    return await wrapper(setDefault, req, identityId);
  } else {
    return notFound();
  }
}
