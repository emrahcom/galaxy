<script lang="ts">
  import { page } from "$app/stores";
  import { get as getProfile } from "$lib/pri/profile";
  import SetDefault from "$lib/components/pri/profile/set-default.svelte";
  import Subheader from "$lib/components/pri/common/subheader.svelte";
  import Warning from "$lib/components/pri/common/warning.svelte";

  const promise = getProfile($page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Set the meeting profile as default" />

{#await promise then profile}
  <SetDefault p={profile} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
