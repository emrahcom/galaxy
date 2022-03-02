<script lang="ts">
  import { list as listDomains } from "$lib/pri/domain";
  import List from "$lib/components/pri/domain/list.svelte";
  import Subheader from "$lib/components/pri/common/subheader-list.svelte";
  import Warning from "$lib/components/pri/common/warning.svelte";

  const promise = listDomains();
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Your Jitsi domains" href="/pri/domain/add" />

{#await promise then domains}
  <List {domains} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
