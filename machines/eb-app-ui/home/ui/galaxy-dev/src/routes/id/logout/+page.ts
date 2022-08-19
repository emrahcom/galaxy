import { redirect } from "@sveltejs/kit";
import { browser } from "$app/env";
import { getLogoutDataModels } from "$lib/kratos";
import type { KratosLoad } from "$lib/kratos/types";

// ---------------------------------------------------------------------------
export async function load(): Promise<KratosLoad> {
  if (!browser) return {};

  const dm = await getLogoutDataModels();

  if (dm.instanceOf === "KratosLogout") {
    throw redirect(302, `${dm.logout_url}`);
  }

  throw redirect(302, "/");
}
