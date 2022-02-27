<script lang="ts">
  import { listProfiles } from "$lib/pri/profile";
  import List from "$lib/components/pri/profile/list.svelte";
  import Subheader from "$lib/components/pri/subheader-list.svelte";
  import Warning from "$lib/components/pri/warning.svelte";

  const promise = listProfiles();
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Your profiles" href="/pri/profile/add" />

{#await promise then profiles}
  <List {profiles} />
{:catch}
  <Warning msg={"Something went wrong"} />
{/await}
