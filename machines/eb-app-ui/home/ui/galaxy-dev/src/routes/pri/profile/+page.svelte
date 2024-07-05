<script lang="ts">
  import { list } from "$lib/api";
  import List from "$lib/components/pri/profile/list.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = list("/api/pri/profile/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader
  subheader="My meeting profiles"
  hrefAdd="/pri/profile/add"
  hrefAddTitle="Add a new meeting profile"
/>

{#await pr then profiles}
  <List {profiles} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
