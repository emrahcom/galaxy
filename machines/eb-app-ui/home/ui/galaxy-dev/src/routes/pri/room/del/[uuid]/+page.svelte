<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Del from "$lib/components/pri/room/del.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/room/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Delete this meeting room" />

{#await pr then room}
  <Del p={room} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
