<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Enable from "$lib/components/pri/room/enable.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/room/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Enable this meeting room" />

{#await pr then room}
  <Enable p={room} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
