<script lang="ts">
  import { page } from "$app/stores";
  import { get as getProfile } from "$lib/pri/profile";
  import Del from "$lib/components/pri/profile/del.svelte";
  import Subheader from "$lib/components/pri/common/subheader.svelte";
  import Warning from "$lib/components/pri/common/warning.svelte";

  const promise = getProfile($page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Delete the meeting profile" />

{#await promise then profile}
  <Del p={profile} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
