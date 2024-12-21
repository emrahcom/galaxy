import { get } from "$lib/api";
import { getIdentity } from "$lib/kratos";

// -----------------------------------------------------------------------------
export async function load() {
  const target = globalThis.location.pathname;

  // Dont continue if the target is the audience pages.
  // The audience pages dont need authentication.
  if (target.match("^/aud/")) return;

  // Get config
  if (
    !globalThis.localStorage.getItem("contact_email") ||
    !globalThis.localStorage.getItem("kratos_fqdn")
  ) {
    const config = await get("/api/adm/config");

    globalThis.localStorage.setItem("contact_email", config.contact_email);
    globalThis.localStorage.setItem("kratos_fqdn", config.kratos_fqdn);
  }

  // Am I authenticated?
  // If yes, refresh the identity.
  // If no, remove storage items except kratos_fqdn.
  await getIdentity()
    .then((_identity) => {
      globalThis.localStorage.setItem("identity_id", _identity.id);
      globalThis.localStorage.setItem("identity_email", _identity.traits.email);
    })
    .catch(() => {
      const contactEmail =
        globalThis.localStorage.getItem("contact_email") || "";
      const kratosFqdn = globalThis.localStorage.getItem("kratos_fqdn") || "";

      globalThis.localStorage.clear();
      globalThis.sessionStorage.clear();
      globalThis.localStorage.setItem("contact_email", contactEmail);
      globalThis.localStorage.setItem("kratos_fqdn", kratosFqdn);
    });
}
