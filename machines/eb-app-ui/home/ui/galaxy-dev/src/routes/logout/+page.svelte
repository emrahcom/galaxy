<script lang="ts">
  import { getLogoutDataModels } from "$lib/kratos";

  async function load() {
    const dm = await getLogoutDataModels();

    globalThis.localStorage.clear();
    globalThis.sessionStorage.clear();

    if (dm.instanceOf === "KratosLogout") {
      globalThis.location.replace(dm.logout_url);
    } else {
      globalThis.location.replace("/");
    }
  }

  load();
</script>
