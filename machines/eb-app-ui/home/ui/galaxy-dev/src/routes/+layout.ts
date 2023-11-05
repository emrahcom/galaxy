import { get } from "$lib/api";
import { getIdentity } from "$lib/kratos";

// -----------------------------------------------------------------------------
export async function load() {
  // Get config
  if (!window.localStorage.getItem("kratos_fqdn")) {
    const config = await get("/api/adm/config");

    window.localStorage.setItem("kratos_fqdn", config.kratos_fqdn);
  }

  await getIdentity()
    .then((_identity) => {
      window.localStorage.setItem("identity_id", _identity.id);
      window.localStorage.setItem("identity_email", _identity.traits.email);
    })
    .catch(() => {
      window.localStorage.removeItem("identity_id");
      window.localStorage.removeItem("identity_email");
    });
}
