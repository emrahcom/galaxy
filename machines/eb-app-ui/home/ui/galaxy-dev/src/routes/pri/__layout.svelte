<script lang="ts" context="module">
  import { KRATOS } from "$lib/config";
  import { get } from "svelte/store";
  import { identity as id } from "$lib/stores/kratos";

  export async function load() {
    const identity = get(id);

    if (!identity) {
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
