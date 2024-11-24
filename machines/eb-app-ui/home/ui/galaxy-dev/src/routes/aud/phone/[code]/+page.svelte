<script lang="ts">
  import { page } from "$app/stores";
  import { getByCode } from "$lib/api";
  import Call from "$lib/components/aud/call.svelte";
  import Home from "$lib/components/common/button-on-click.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const code = $page.params.code;

  const pr = getByCode("/api/pub/phone/get/bycode", code);

  // ---------------------------------------------------------------------------
  function goHome() {
    globalThis.location.href = `/`;
  }
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Make a call" />

{#await pr then phone}
  <Call p={phone} />
{:catch}
  <Warning>No active phone found</Warning>

  <center>
    <Home label="Home Page" onclick={goHome} />
  </center>
{/await}
