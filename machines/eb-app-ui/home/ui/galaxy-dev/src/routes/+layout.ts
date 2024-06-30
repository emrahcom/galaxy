import { get } from "$lib/api";
import { getIdentity } from "$lib/kratos";

// -----------------------------------------------------------------------------
export async function load() {
  // Get config
  if (!window.localStorage.getItem("kratos_fqdn")) {
    const config = await get("/api/adm/config");

    window.localStorage.setItem("kratos_fqdn", config.kratos_fqdn);
  }

  if (!window.sessionStorage.getItem("identity_id")) {
    await getIdentity()
      .then((_identity) => {
        window.sessionStorage.setItem("identity_id", _identity.id);
        window.sessionStorage.setItem("identity_email", _identity.traits.email);
      })
      .catch(() => {
        window.sessionStorage.removeItem("identity_id");
        window.sessionStorage.removeItem("identity_email");
      });
  }
}
