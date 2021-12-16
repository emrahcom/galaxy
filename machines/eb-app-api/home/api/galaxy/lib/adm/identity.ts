import { notFound } from "../http/response.ts";
import { adm as wrapper } from "../http/wrapper.ts";
import { addIdentity } from "../database/identity.ts";
import { addProfile } from "../database/profile.ts";

const PRE = "/api/adm/identity";

// -----------------------------------------------------------------------------
async function add(req: Deno.RequestEvent) {
  const pl = await req.request.json();
  const identityId = pl.identity_id;
  const email = pl.identity_email;
  const name = identityEmail.split("@")[0];
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
export default function (req: Deno.RequestEvent, path: string) {
  if (path === `${PRE}/add`) {
    wrapper(add, req);
  } else {
    notFound(req);
  }
}
