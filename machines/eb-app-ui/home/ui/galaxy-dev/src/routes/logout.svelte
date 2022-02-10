<script lang="ts" context="module">
  import { getLogoutDataModels } from "$lib/kratos";
  import type { KratosLoad } from "$lib/kratos-types";

  export async function load(): Promise<KratosLoad> {
    const dm = await getLogoutDataModels();

    if (dm.instanceOf === "KratosLogout") {
      return {
        status: 302,
        redirect: `${dm.logout_url}`,
      };
    } else {
      console.log(dm);
      return {};
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<p class="text-center">Something went wrong</p>
