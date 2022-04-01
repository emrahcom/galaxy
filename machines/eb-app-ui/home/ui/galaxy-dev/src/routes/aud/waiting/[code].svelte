<script lang="ts">
  import { page } from "$app/stores";
  import { getByCode } from "$lib/api";
  import Home from "$lib/components/common/button-on-click.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const code = $page.params.code;

  const pr = getByCode("/api/pub/meeting/get/bycode", code);

  // ---------------------------------------------------------------------------
  function goHome() {
    window.location.href = `/`;
  }
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Welcome to the waiting room" />

{#await pr then meeting}
  {console.log(meeting)}
{:catch}
  <Warning>No scheduled meeting found</Warning>

  <center>
    <Home label="Home Page" on:click={goHome} />
  </center>
{/await}
