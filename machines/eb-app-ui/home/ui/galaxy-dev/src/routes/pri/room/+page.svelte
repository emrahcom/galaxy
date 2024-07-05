<script lang="ts">
  import { list } from "$lib/api";
  import List from "$lib/components/pri/room/list.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr1 = list("/api/pri/room/list", 100);
  const pr2 = list("/api/pri/room/partner/candidacy/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader
  subheader="My meeting rooms"
  hrefAdd="/pri/room/add"
  hrefAddTitle="Add a new meeting room"
/>

{#await Promise.all([pr1, pr2]) then [rooms, candidacies]}
  <List {rooms} {candidacies} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
