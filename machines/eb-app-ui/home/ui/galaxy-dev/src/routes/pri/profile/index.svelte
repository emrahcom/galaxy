<script lang="ts">
  import Profiles from "$lib/components/pri/list-profiles.svelte";
  import Subheader from "$lib/components/pri/subheader-list.svelte";
  import { listProfiles } from "$lib/pri/profile";

  const promise = listProfiles();
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Your profiles" href="/pri/profile/add" />

{#await promise then profiles}
  <Profiles {profiles} />
{:catch}
  <p class="text-center">Something went wrong</p>
{/await}
