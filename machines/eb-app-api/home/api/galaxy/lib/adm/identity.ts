import { notFound } from "../http/response.ts";
import { adm as wrapper } from "../http/wrapper.ts";
import { addIdentity } from "../database/identity.ts";
import { addProfile } from "../database/profile.ts";

const PRE = "/api/adm/identity";

// -----------------------------------------------------------------------------
async function add(req: Request): Promise<unknown> {
  const pl = await req.json();
  const identityId = pl.identity_id;
  const email = pl.identity_email;
  const name = email.split("@")[0];
  const rows = await addIdentity(identityId);

  if (rows[0] !== undefined) {
    await addProfile(
      identityId,
      name,
      email,
      true,
    );
  }

  return rows;
}

// -----------------------------------------------------------------------------
export default async function (req: Request, path: string): Promise<Response> {
  if (path === `${PRE}/add`) {
    return await wrapper(add, req);
  } else {
    return notFound();
  }
}
