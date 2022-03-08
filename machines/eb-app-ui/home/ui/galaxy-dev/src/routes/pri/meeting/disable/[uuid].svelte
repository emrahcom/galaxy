<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Disable from "$lib/components/pri/meeting/disable.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const promise = getById("/api/pri/meeting/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Disable this meeting" />

{#await promise then meeting}
  <Disable p={meeting} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
