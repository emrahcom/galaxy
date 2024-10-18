import { notFound } from "../http/response.ts";
import { pri as wrapper } from "../http/wrapper.ts";
import {
  addContactFriendshipByCode,
  checkContactFriendshipByCode,
} from "../database/contact-friendship.ts";

const PRE = "/api/pri/contact/friendship";

// -----------------------------------------------------------------------------
async function checkByCode(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await checkContactFriendshipByCode(identityId, code);
}

// -----------------------------------------------------------------------------
async function addByCode(req: Request, identityId: string): Promise<unknown> {
  const pl = await req.json();
  const code = pl.code;

  return await addContactFriendshipByCode(identityId, code);
}

// -----------------------------------------------------------------------------
export default async function (
  req: Request,
  path: string,
  identityId: string,
): Promise<Response> {
  if (path === `${PRE}/check/bycode`) {
    return await wrapper(checkByCode, req, identityId);
  } else if (path === `${PRE}/add/bycode`) {
    return await wrapper(addByCode, req, identityId);
  } else {
    return notFound();
  }
}
