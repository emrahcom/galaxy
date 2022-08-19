<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Disable from "$lib/components/pri/meeting-invite/disable.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/meeting/invite/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Disable this participant key" />

{#await pr then invite}
  <Disable p={invite} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
