<script lang="ts">
  import { list } from "$lib/api";
  import List from "$lib/components/pri/contact/list.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = list("/api/pri/contact/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="My contacts" />

{#await pr then contacts}
  <List {contacts} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
