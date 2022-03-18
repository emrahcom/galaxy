<script lang="ts">
  import { list } from "$lib/api";
  import List from "$lib/components/pri/room/list.svelte";
  import Subheader from "$lib/components/common/subheader-add.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = list("/api/pri/room/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="My meeting rooms" hrefAdd="/pri/room/add" />

{#await pr then rooms}
  <List {rooms} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
