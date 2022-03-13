<script lang="ts">
  import { list } from "$lib/api";
  import List from "$lib/components/pri/room/list.svelte";
  import Subheader from "$lib/components/common/subheader-pri-list.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = list("/api/pri/room/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="My meeting rooms" href="/pri/room/add" />

{#await pr then rooms}
  <List {rooms} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
