<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Add from "$lib/components/pri/room-invite/add.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const roomId = $page.params.room_uuid;

  const pr = getById("/api/pri/room/get", roomId);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Add a partner key" />

{#await pr then room}
  <Add {room} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
