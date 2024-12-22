<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Disable from "$lib/components/pri/key/disable.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/key/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Disable this private key" />

{#await pr then key}
  <Disable p={key} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
