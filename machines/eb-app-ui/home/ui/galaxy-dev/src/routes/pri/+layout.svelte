<script lang="ts">
  import { get } from "svelte/store";
  import identity from "$lib/stores/kratos/identity";

  const KRATOS_FQDN = window.localStorage.getItem("kratos_fqdn");
  const loginUrl = `https://${KRATOS_FQDN}/self-service/login/browser`;
  const _identity = get(identity);

  if (!_identity.id) window.location.replace(loginUrl);
</script>

<!-- -------------------------------------------------------------------------->
<slot />
