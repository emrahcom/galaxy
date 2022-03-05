<script lang="ts">
  import { page } from "$app/stores";
  import { get } from "$lib/pri/api";
  import Enable from "$lib/components/pri/room/enable.svelte";
  import Subheader from "$lib/components/pri/common/subheader.svelte";
  import Warning from "$lib/components/pri/common/warning.svelte";

  const promise = get("/api/pri/room/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Enable this meeting room" />

{#await promise then room}
  <Enable p={room} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
