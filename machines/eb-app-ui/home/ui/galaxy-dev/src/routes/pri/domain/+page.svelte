<script lang="ts">
  import { list } from "$lib/api";
  import List from "$lib/components/pri/domain/list.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr1 = list("/api/pri/domain/list", 100);
  const pr2 = list("/api/pri/domain/partner/candidacy/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader
  subheader="My Jitsi domains"
  hrefAdd="/pri/domain/add"
  hrefAddTitle="Add a new Jitsi domain"
/>

{#await Promise.all([pr1, pr2]) then [domains, candidacies]}
  <List {domains} {candidacies} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
