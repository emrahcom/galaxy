import { notFound, responsePri } from "../common/http-response.ts";
import { getLimit, getOffset } from "../common/database.ts";
import {
  addProfile,
  delProfile,
  getDefaultProfile,
  getProfile,
  listProfile,
  setDefaultProfile,
  updateProfile,
} from "../common/profile.ts";

const PRE = "/api/pri/profile";

// -----------------------------------------------------------------------------
async function get(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const profileId = pl.id;

  return await getProfile(identityId, profileId);
}

// -----------------------------------------------------------------------------
async function getDefault(_req: Deno.RequestEvent, identityId: string) {
  return await getDefaultProfile(identityId);
}

// -----------------------------------------------------------------------------
async function list(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const limit = getLimit(pl.limit);
  const offset = getOffset(pl.offset);

  return await listProfile(identityId, limit, offset);
}

// -----------------------------------------------------------------------------
async function add(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const profileName = pl.name;
  const profileEmail = pl.email;

  return await addProfile(identityId, profileName, profileEmail);
}

// -----------------------------------------------------------------------------
async function del(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const profileId = pl.id;

  return await delProfile(identityId, profileId);
}

// -----------------------------------------------------------------------------
async function update(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const profileId = pl.id;
  const profileName = pl.name;
  const profileEmail = pl.email;

  return await updateProfile(identityId, profileId, profileName, profileEmail);
}

// -----------------------------------------------------------------------------
async function setDefault(req: Deno.RequestEvent, identityId: string) {
  const pl = await req.request.json();
  const profileId = pl.id;

  return await setDefaultProfile(identityId, profileId);
}

// -----------------------------------------------------------------------------
export default function (
  req: Deno.RequestEvent,
  path: string,
  identityId: string,
) {
  if (path === `${PRE}/get`) {
    responsePri(get, req, identityId);
  } else if (path === `${PRE}/get/default`) {
    responsePri(getDefault, req, identityId);
  } else if (path === `${PRE}/list`) {
    responsePri(list, req, identityId);
  } else if (path === `${PRE}/add`) {
    responsePri(add, req, identityId);
  } else if (path === `${PRE}/del`) {
    responsePri(del, req, identityId);
  } else if (path === `${PRE}/update`) {
    responsePri(update, req, identityId);
  } else if (path === `${PRE}/set/default`) {
    responsePri(setDefault, req, identityId);
  } else {
    notFound(req);
  }
}
