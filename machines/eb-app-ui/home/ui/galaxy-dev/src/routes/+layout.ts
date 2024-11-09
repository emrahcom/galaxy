import { get } from "$lib/api";
import { getIdentity } from "$lib/kratos";

// -----------------------------------------------------------------------------
export async function load() {
  const target = globalThis.location.pathname;

  // Dont continue if the target is the audience pages.
  // The audience pages dont need authentication.
  if (target.match("^/aud/")) return;

  // Get config
  if (!globalThis.localStorage.getItem("kratos_fqdn")) {
    const config = await get("/api/adm/config");

    globalThis.localStorage.setItem("kratos_fqdn", config.kratos_fqdn);
  }

  // Am I authenticated?
  //
  // Assumed that the user is authenticated if these two storages values
  // exists instead of asking her authentication status to Kratos every time.
  // This decreases the network traffic (which is not every important) and the
  // load on Kratos (this may be critical in high load).
  //
  // The stored identity is removed if intercom fails and te new auth flow is
  // triggered in this case.
  if (
    !globalThis.sessionStorage.getItem("kratos_authenticated") ||
    !globalThis.localStorage.getItem("identity_id")
  ) {
    await getIdentity()
      .then((_identity) => {
        globalThis.localStorage.setItem("identity_id", _identity.id);
        globalThis.localStorage.setItem(
          "identity_email",
          _identity.traits.email,
        );
        globalThis.sessionStorage.setItem("kratos_authenticated", "ok");
      })
      .catch(() => {
        const kratosFqdn = globalThis.localStorage.getItem("kratos_fqdn") || "";

        globalThis.localStorage.clear();
        globalThis.sessionStorage.clear();
        globalThis.localStorage.setItem("kratos_fqdn", kratosFqdn);
      });
  }
}
