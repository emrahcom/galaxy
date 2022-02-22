import { KRATOS } from "$lib/config";
import type {
  KratosError,
  KratosForm,
  KratosIdentity,
  KratosLoad,
  KratosLogout,
} from "$lib/kratos/types";

// -----------------------------------------------------------------------------
export function getFlowId(): string {
  const qs = new URLSearchParams(window.location.search);

  return qs.get("flow");
}

// -----------------------------------------------------------------------------
export async function getIdentity(): Promise<KratosIdentity> {
  const url = `${KRATOS}/sessions/whoami`;
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Accept": "application/json",
    },
    mode: "cors",
  });

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
  const url = `${KRATOS}/self-service/${flow}/flows?id=${flowId}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Accept": "application/json",
    },
    mode: "cors",
  });

  const dm = await res.json();

  if (dm.error) {
    dm.instanceOf = "KratosError";
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
  const url = `${KRATOS}/self-service/logout/browser`;
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Accept": "application/json",
    },
    mode: "cors",
  });

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

// -----------------------------------------------------------------------------
export async function getKratosLoad(flow: string): Promise<KratosLoad> {
  const flowId = getFlowId();

  // get flowId if there is no one
  if (!flowId) {
    return {
      status: 302,
      redirect: `${KRATOS}/self-service/${flow}/browser`,
    };
  }

  const dm = await getDataModels(flow, flowId);

  // redirect if this is KratosError and there is a redirect_to
  if (
    dm.instanceOf === "KratosError" &&
    dm.error.details &&
    dm.error.details.redirect_to
  ) {
    return {
      status: 302,
      redirect: `${dm.error.details.redirect_to}`,
    };
  }

  // return data models
  return {
    props: {
      dm,
    },
  };
}
