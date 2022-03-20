<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Enable from "$lib/components/pri/room-invite/enable.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/room/invite/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Enable this partner key" />

{#await pr then invite}
  <Enable p={invite} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
