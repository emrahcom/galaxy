<script lang="ts" context="module">
  import { getLogoutData } from "$lib/kratos";
  import type { LoadOutput } from "$lib/custom-types";

  export async function load(): Promise<LoadOutput> {
    const dm = await getLogoutData();

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
<p>something went wrong</p>
