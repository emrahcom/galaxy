<script lang="ts" context="module">
  import { KRATOS } from "$lib/config";
  import { getIdentity } from "$lib/kratos";

  export async function load() {
    await getIdentity().catch(() => {
      return {
        status: 302,
        redirect: `${KRATOS}/self-service/login/browser`,
      };
    });
  }
</script>

<!-- -------------------------------------------------------------------------->
<slot />
