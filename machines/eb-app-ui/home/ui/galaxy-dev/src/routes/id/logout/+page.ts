import { browser } from "$app/environment";
import { getLogoutDataModels } from "$lib/kratos";

// -----------------------------------------------------------------------------
export async function load() {
  if (!browser) return {};

  const dm = await getLogoutDataModels();

  if (dm.instanceOf === "KratosLogout") {
    window.location.replace(dm.logout_url);
  } else {
    window.location.replace("/");
  }
}
