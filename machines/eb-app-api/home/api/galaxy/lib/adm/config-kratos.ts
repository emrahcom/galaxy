import { ok } from "../http/response.ts";
import { KRATOS_FQDN } from "../../config.ts";
import { CONTACT_EMAIL } from "../../config.ts";

// -----------------------------------------------------------------------------
export default function (): Response {
  const config = [{
    contact_email: CONTACT_EMAIL,
    kratos_fqdn: KRATOS_FQDN,
  }];

  return ok(JSON.stringify(config));
}
