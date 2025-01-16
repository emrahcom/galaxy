<script lang="ts">
  import { list } from "$lib/api";
  import List from "$lib/components/pri/phone/list.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = list("/api/pri/phone/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader
  subheader="My public phones"
  hrefAdd="/pri/phone/add"
  hrefAddTitle="Add a new public phone"
/>

{#await pr then phones}
  <List {phones} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
