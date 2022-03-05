<script lang="ts">
  import { page } from "$app/stores";
  import { get } from "$lib/api";
  import Del from "$lib/components/pri/room/del.svelte";
  import Subheader from "$lib/components/pri/common/subheader.svelte";
  import Warning from "$lib/components/pri/common/warning.svelte";

  const promise = get("/api/pri/room/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Delete this meeting room" />

{#await promise then room}
  <Del p={room} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
