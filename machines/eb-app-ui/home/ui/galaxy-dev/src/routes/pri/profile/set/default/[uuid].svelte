<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import SetDefault from "$lib/components/pri/profile/set-default.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/warning.svelte";

  const promise = getById("/api/pri/profile/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Set as default profile" />

{#await promise then profile}
  <SetDefault p={profile} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
