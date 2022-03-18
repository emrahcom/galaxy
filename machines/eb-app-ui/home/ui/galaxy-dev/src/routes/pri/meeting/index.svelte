<script lang="ts">
  import { list } from "$lib/api";
  import List from "$lib/components/pri/meeting/list.svelte";
  import Subheader from "$lib/components/common/subheader-add.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = list("/api/pri/meeting/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="My meetings" hrefAdd="/pri/meeting/add" />

{#await pr then meetings}
  <List {meetings} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
