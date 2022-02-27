<script lang="ts">
  import { page } from "$app/stores";
  import { getProfile } from "$lib/pri/profile";
  import Subheader from "$lib/components/pri/subheader.svelte";
  import Update from "$lib/components/pri/profile/update.svelte";

  const promise = getProfile($page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Update profile" />

{#await promise then profile}
  <Update p={profile} />
{:catch}
  <p class="text-center">Something went wrong</p>
{/await}
