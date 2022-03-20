<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Del from "$lib/components/pri/room-partnership/del.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById(
    "/api/pri/room/partnership/get/byroom",
    $page.params.room_id,
  );
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Delete this partner room" />

{#await pr then partnership}
  <Del p={partnership} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
