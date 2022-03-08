<script lang="ts">
  import { list } from "$lib/api";
  import List from "$lib/components/pri/meeting/list.svelte";
  import Subheader from "$lib/components/common/subheader-pri-list.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const promise = list("/api/pri/meeting/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="My meetings" href="/pri/meeting/add" />

{#await promise then meetings}
  <List {meetings} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
