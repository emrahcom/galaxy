<script lang="ts">
  import { listProfiles } from "$lib/pri/profile";
  import List from "$lib/components/pri/profile/list.svelte";
  import Subheader from "$lib/components/pri/subheader-list.svelte";

  const promise = listProfiles();
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Your profiles" href="/pri/profile/add" />

{#await promise then profiles}
  <List {profiles} />
{:catch}
  <p class="text-center">Something went wrong</p>
{/await}
