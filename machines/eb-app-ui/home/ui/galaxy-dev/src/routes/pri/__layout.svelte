<script lang="ts" context="module">
  import { KRATOS } from "$lib/config";
  import { get } from "svelte/store";
  import identity from "$lib/stores/kratos/identity";

  // ---------------------------------------------------------------------------
  export async function load() {
    const _identity = get(identity);

    if (!_identity.id) {
      return {
        status: 302,
        redirect: `${KRATOS}/self-service/login/browser`,
      };
    }

    return {};
  }
</script>

<!-- -------------------------------------------------------------------------->
<slot />
