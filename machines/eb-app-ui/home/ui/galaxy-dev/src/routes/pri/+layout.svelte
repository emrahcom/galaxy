<script lang="ts">
  import { browser } from "$app/environment";
  import { KRATOS } from "$lib/config";
  import { get } from "svelte/store";
  import identity from "$lib/stores/kratos/identity";

  if (browser) {
    const _identity = get(identity);
    const loginUrl = `${KRATOS}/self-service/login/browser`;

    if (!_identity.id) window.location.replace(loginUrl);
  }
</script>

<!-- -------------------------------------------------------------------------->
<slot />
