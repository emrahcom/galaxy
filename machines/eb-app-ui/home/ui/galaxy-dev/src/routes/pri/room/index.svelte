<script lang="ts">
  import { list } from "$lib/pri/api";
  import List from "$lib/components/pri/room/list.svelte";
  import Subheader from "$lib/components/pri/common/subheader-list.svelte";
  import Warning from "$lib/components/pri/common/warning.svelte";

  const promise = list("/api/pri/room/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Your meeting rooms" href="/pri/room/add" />

{#await promise then rooms}
  <List {rooms} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
