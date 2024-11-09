<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  const KRATOS_FQDN = globalThis.localStorage.getItem("kratos_fqdn");
  const loginUrl = `https://${KRATOS_FQDN}/self-service/login/browser`;
  const identity_id = globalThis.localStorage.getItem("identity_id");
  const returnTo = globalThis.location.href;

  if (!identity_id) {
    globalThis.location.replace(`${loginUrl}?return_to=${returnTo}`);
  }
</script>

<!-- -------------------------------------------------------------------------->
{@render children()}
