<script lang="ts">
  import { page } from "$app/stores";
  import { getById, listById } from "$lib/api";
  import type { Room } from "$lib/types";
  import List from "$lib/components/pri/room-partner/list.svelte";
  import Subheader from "$lib/components/common/subheader-back.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const roomId = $page.params.room_uuid;
  let roomName = "";

  const pr1 = getById("/api/pri/room/get", roomId).then((item: Room) => {
    roomName = item.name;
  });
  const pr2 = listById("/api/pri/room/partner/list/byroom", roomId, 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Partners of {roomName}" hrefBack="/pri/room" />

<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
{#await Promise.all([pr1, pr2]) then [_room, partners]}
  <List {partners} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
