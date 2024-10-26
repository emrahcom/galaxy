<script lang="ts">
  import { page } from "$app/stores";
  import { getById, listById } from "$lib/api";
  import type { Room } from "$lib/types";
  import List from "$lib/components/pri/room-partner/list.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const roomId = $page.params.room_uuid;
  let roomName = $state("");

  const pr1 = getById("/api/pri/room/get", roomId).then((item: Room) => {
    roomName = item.name;
  });
  const pr2 = listById("/api/pri/room/partner/list/byroom", roomId, 100);
  const pr3 = listById(
    "/api/pri/room/partner/candidate/list/byroom",
    roomId,
    100,
  );
</script>

<!-- -------------------------------------------------------------------------->
<Subheader
  subheader="Partners of {roomName}"
  hrefAdd="/pri/room/partner/candidate/add/{roomId}"
  hrefAddTitle="Add a new partner"
  hrefBack="/pri/room"
/>

<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
{#await Promise.all([pr1, pr2, pr3]) then [_room, partners, candidates]}
  <List {partners} {candidates} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
