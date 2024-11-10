import { ok } from "../http/response.ts";
import { KRATOS_FQDN } from "../../config.ts";

// -----------------------------------------------------------------------------
export default function (): Response {
  const config = [{
    kratos_fqdn: KRATOS_FQDN,
  }];

  return ok(JSON.stringify(config));
}
