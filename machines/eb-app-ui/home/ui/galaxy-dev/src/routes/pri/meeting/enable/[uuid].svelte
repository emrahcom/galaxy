<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Enable from "$lib/components/pri/meeting/enable.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/meeting/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Enable this meeting" />

{#await pr then meeting}
  <Enable p={meeting} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
