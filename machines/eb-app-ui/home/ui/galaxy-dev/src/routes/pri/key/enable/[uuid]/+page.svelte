<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Enable from "$lib/components/pri/key/enable.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/key/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Enable this private key" />

{#await pr then key}
  <Enable p={key} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
