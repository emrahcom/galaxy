import { get } from "$lib/api";
import { getIdentity } from "$lib/kratos";

// -----------------------------------------------------------------------------
export async function load() {
  const target = window.location.pathname;

  // Dont continue if the target is the audience pages.
  // The audience pages dont need authentication.
  if (target.match("^/aud/")) return;

  // Get config
  if (!window.localStorage.getItem("kratos_fqdn")) {
    const config = await get("/api/adm/config");

    window.localStorage.setItem("kratos_fqdn", config.kratos_fqdn);
  }

  // Am I authenticated
  if (
    !window.sessionStorage.getItem("kratos_authenticated") ||
    !window.localStorage.getItem("identity_id")
  ) {
    await getIdentity()
      .then((_identity) => {
        window.localStorage.setItem("identity_id", _identity.id);
        window.localStorage.setItem("identity_email", _identity.traits.email);
        window.sessionStorage.setItem("kratos_authenticated", "ok");
      })
      .catch(() => {
        window.localStorage.removeItem("identity_id");
        window.localStorage.removeItem("identity_email");
        window.sessionStorage.removeItem("kratos_authenticated");
      });
  }
}
