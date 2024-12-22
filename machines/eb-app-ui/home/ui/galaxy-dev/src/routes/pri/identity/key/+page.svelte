<script lang="ts">
  import { list } from "$lib/api";
  import List from "$lib/components/pri/identity-key/list.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = list("/api/pri/identity/key/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader
  subheader="My private keys"
  hrefAdd="/pri/identity/key/add"
  hrefAddTitle="Add a new private key"
/>

{#await pr then keys}
  <List {keys} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
