<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Update from "$lib/components/pri/room/update.svelte";
  import Warning from "$lib/components/common/warning.svelte";

  const promise = getById("/api/pri/room/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Update this meeting room" />

{#await promise then room}
  <Update p={room} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
