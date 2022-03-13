<script lang="ts">
  import { list } from "$lib/api";
  import List from "$lib/components/pri/domain/list.svelte";
  import Subheader from "$lib/components/common/subheader-pri-list.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = list("/api/pri/domain/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="My Jitsi domains" href="/pri/domain/add" />

{#await pr then domains}
  <List {domains} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
