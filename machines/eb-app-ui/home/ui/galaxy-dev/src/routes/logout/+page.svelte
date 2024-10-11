<script lang="ts">
  import { getLogoutDataModels } from "$lib/kratos";

  async function load() {
    const dm = await getLogoutDataModels();

    globalThis.localStorage.removeItem("identity_id");
    globalThis.localStorage.removeItem("identity_email");
    globalThis.sessionStorage.removeItem("kratos_authenticated");

    if (dm.instanceOf === "KratosLogout") {
      globalThis.location.replace(dm.logout_url);
    } else {
      globalThis.location.replace("/");
    }
  }

  load();
</script>
