<script lang="ts">
  import { page } from "$app/stores";
  import { getById, listById } from "$lib/api";
  import type { Room } from "$lib/types";
  import List from "$lib/components/pri/room-invite/list.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const roomId = $page.params.room_uuid;
  let roomName = $state("");

  const pr1 = getById("/api/pri/room/get", roomId).then((item: Room) => {
    roomName = item.name;
  });
  const pr2 = listById("/api/pri/room/invite/list/byroom", roomId, 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader
  subheader="Partner keys of {roomName}"
  hrefAdd="/pri/room/invite/add/{roomId}"
  hrefAddTitle="Add a new partner key (partnership link)"
  hrefBack="/pri/room"
/>

<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
{#await Promise.all([pr1, pr2]) then [_room, invites]}
  <List {invites} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
