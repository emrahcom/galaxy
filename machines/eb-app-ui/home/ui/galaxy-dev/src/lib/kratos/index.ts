import { get } from "$lib/http";
import type {
  KratosError,
  KratosIdentity,
  KratosLogout,
} from "$lib/kratos/types";

// -----------------------------------------------------------------------------
export async function getIdentity(): Promise<KratosIdentity> {
  const KRATOS_FQDN = globalThis.localStorage.getItem("kratos_fqdn");
  const url = `https://${KRATOS_FQDN}/sessions/whoami`;
  const res = await get(url);

  if (res.status !== 200) {
    throw "no identity";
  }

  const dm = await res.json();
  return dm.identity;
}

// -----------------------------------------------------------------------------
export async function getLogoutDataModels(): Promise<
  KratosLogout | KratosError
> {
  const KRATOS_FQDN = globalThis.localStorage.getItem("kratos_fqdn");
  const url = `https://${KRATOS_FQDN}/self-service/logout/browser`;
  const res = await get(url);
  const dm = await res.json();

  if (dm.error) {
    dm.instanceOf = "KratosError";
  } else if (dm.logout_url) {
    dm.instanceOf = "KratosLogout";
  } else {
    throw "unexpected Kratos object";
  }

  return dm;
}
