<script lang="ts">
  import Subheader from "$lib/components/pri/sunheader.svelte";
  import { listProfiles } from "$lib/pri/profile";

  const promise = listProfiles();
</script>

<!-- -------------------------------------------------------------------------->
<Subheader />

{#await promise}
  <p class="text-center">Waiting...</p>
{:then profiles}
  {console.log(profiles)}
{:catch}
  <p class="text-center">Something went wrong</p>
{/await}
