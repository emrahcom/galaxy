import { getLogoutDataModels } from "$lib/kratos";

// -----------------------------------------------------------------------------
export async function load() {
  const dm = await getLogoutDataModels();

  if (dm.instanceOf === "KratosLogout") {
    window.location.replace(dm.logout_url);
  } else {
    window.location.replace("/");
  }
}
