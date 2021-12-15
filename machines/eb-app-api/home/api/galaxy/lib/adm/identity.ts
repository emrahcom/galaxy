import { internalServerError, notFound, ok } from "../common/http-response.ts";
import { addIdentity } from "../common/identity.ts";
import { addProfile } from "../common/profile.ts";

const PRE = "/api/adm/identity";

// -----------------------------------------------------------------------------
async function add(req: Deno.RequestEvent) {
  try {
    const pl = await req.request.json();
    const identityId = pl.identity_id;
    const identityEmail = pl.identity_email;
    const identityName = identityEmail.split("@")[0];
    const rows = await addIdentity(identityId);

    if (rows[0] !== undefined) {
      await addProfile(
        identityId,
        identityName,
        identityEmail,
        true,
      );
    }

    ok(req, JSON.stringify(rows));
  } catch {
    internalServerError(req);
  }
}

// -----------------------------------------------------------------------------
export default function (req: Deno.RequestEvent, path: string) {
  if (path === `${PRE}/add`) {
    add(req);
  } else {
    notFound(req);
  }
}
