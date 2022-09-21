import { browser } from "$app/environment";
import { KRATOS } from "$lib/config";
import { get } from "$lib/http";
import type {
  KratosError,
  KratosForm,
  KratosIdentity,
  KratosLogout,
} from "$lib/kratos/types";

// -----------------------------------------------------------------------------
export function getFlowId(urlSearch: string): string {
  const qs = new URLSearchParams(urlSearch);
  const flowId = qs.get("flow");

  if (flowId) return flowId;

  return "";
}

// -----------------------------------------------------------------------------
export async function getIdentity(): Promise<KratosIdentity> {
  if (!browser) throw new Error("no browser env");

  const url = `${KRATOS}/sessions/whoami`;
  const res = await get(url);

  if (res.status !== 200) {
    throw new Error("no identity");
  }

  const dm = await res.json();
  return dm.identity;
}

// -----------------------------------------------------------------------------
export async function getDataModels(
  flow: string,
  flowId: string,
): Promise<KratosForm | KratosError> {
  if (!flowId) throw new Error("no flowId");
  if (!browser) throw new Error("no browser env");

  const url = `${KRATOS}/self-service/${flow}/flows?id=${flowId}`;
  const res = await get(url);
  const dm = await res.json();

  if (dm.error) {
    dm.instanceOf = "KratosError";

    if (dm.error.details && dm.error.details.redirect_to) {
      window.location.href = dm.error.details.redirect_to;
    }
  } else if (dm.ui) {
    dm.instanceOf = "KratosForm";
  } else {
    throw new Error("unexpected Kratos object");
  }

  return dm;
}

// -----------------------------------------------------------------------------
export async function getLogoutDataModels(): Promise<
  KratosLogout | KratosError
> {
  if (!browser) throw new Error("no browser env");

  const url = `${KRATOS}/self-service/logout/browser`;
  const res = await get(url);
  const dm = await res.json();

  if (dm.error) {
    dm.instanceOf = "KratosError";
  } else if (dm.logout_url) {
    dm.instanceOf = "KratosLogout";
  } else {
    throw new Error("unexpected Kratos object");
  }

  return dm;
}
