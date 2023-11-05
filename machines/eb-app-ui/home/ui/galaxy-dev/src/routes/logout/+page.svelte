<script lang="ts">
  import { getLogoutDataModels } from "$lib/kratos";

  async function load() {
    const dm = await getLogoutDataModels();

    window.localStorage.removeItem("identity_id");
    window.localStorage.removeItem("identity_email");

    if (dm.instanceOf === "KratosLogout") {
      window.location.replace(dm.logout_url);
    } else {
      window.location.replace("/");
    }
  }

  load();
</script>
