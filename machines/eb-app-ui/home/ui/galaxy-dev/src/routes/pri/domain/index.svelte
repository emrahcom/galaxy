<script lang="ts">
  import { list } from "$lib/pri/api";
  import List from "$lib/components/pri/domain/list.svelte";
  import Subheader from "$lib/components/pri/common/subheader-list.svelte";
  import Warning from "$lib/components/pri/common/warning.svelte";

  const promise = list("/api/pri/domain/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Your Jitsi domains" href="/pri/domain/add" />

{#await promise then domains}
  <List {domains} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
