<script lang="ts">
  import { list } from "$lib/pri/api";
  import List from "$lib/components/pri/profile/list.svelte";
  import Subheader from "$lib/components/pri/common/subheader-list.svelte";
  import Warning from "$lib/components/pri/common/warning.svelte";

  const promise = list("/api/pri/profile/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Your meeting profiles" href="/pri/profile/add" />

{#await promise then profiles}
  <List {profiles} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
