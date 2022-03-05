<script lang="ts">
  import { page } from "$app/stores";
  import { get } from "$lib/api";
  import Disable from "$lib/components/pri/room/disable.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/warning.svelte";

  const promise = get("/api/pri/room/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Disable this meeting room" />

{#await promise then room}
  <Disable p={room} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
