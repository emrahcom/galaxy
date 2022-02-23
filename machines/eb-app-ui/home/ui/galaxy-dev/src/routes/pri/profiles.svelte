<script lang="ts">
  import Subheader from "$lib/components/pri/list-subheader.svelte";
  import { listProfiles } from "$lib/pri/profile";

  const promise = listProfiles();
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Your profiles" href="/pri/profile/add" />

{#await promise}
  <p class="text-center">Waiting...</p>
{:then profiles}
  {console.log(profiles)}
{:catch}
  <p class="text-center">Something went wrong</p>
{/await}
