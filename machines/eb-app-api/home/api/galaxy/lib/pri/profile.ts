import { internalServerError, notFound, ok } from "../common/http-response.ts";
import { getLimit, getOffset } from "./database.ts";
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
  try {
    const pl = await req.request.json();
    const profileId = pl.id;
    const rows = await getProfile(identityId, profileId);

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
async function getDefault(req: Deno.RequestEvent, identityId: string) {
  try {
    const rows = await getDefaultProfile(identityId);

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
async function list(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const limit = getLimit(pl.limit);
    const offset = getOffset(pl.offset);
    const rows = await listProfile(identityId, limit, offset);

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
async function add(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const profileName = pl.name;
    const profileEmail = pl.email;
    const rows = await addProfile(identityId, profileName, profileEmail);

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
async function del(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const profileId = pl.id;
    const rows = await delProfile(identityId, profileId);

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
async function update(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const profileId = pl.id;
    const profileName = pl.name;
    const profileEmail = pl.email;
    const rows = await updateProfile(
      identityId,
      profileId,
      profileName,
      profileEmail,
    );

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
async function setDefault(req: Deno.RequestEvent, identityId: string) {
  try {
    const pl = await req.request.json();
    const profileId = pl.id;
    const rows = await setDefaultProfile(identityId, profileId);

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export default function (
  req: Deno.RequestEvent,
  path: string,
  identityId: string,
) {
  if (path === `${PRE}/get`) {
    get(req, identityId);
  } else if (path === `${PRE}/get/default`) {
    getDefault(req, identityId);
  } else if (path === `${PRE}/list`) {
    list(req, identityId);
  } else if (path === `${PRE}/add`) {
    add(req, identityId);
  } else if (path === `${PRE}/del`) {
    del(req, identityId);
  } else if (path === `${PRE}/update`) {
    update(req, identityId);
  } else if (path === `${PRE}/set/default`) {
    setDefault(req, identityId);
  } else {
    notFound(req);
  }
}
