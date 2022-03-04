<script lang="ts">
  import { page } from "$app/stores";
  import { get } from "$lib/pri/api";
  import SetDefault from "$lib/components/pri/profile/set-default.svelte";
  import Subheader from "$lib/components/pri/common/subheader.svelte";
  import Warning from "$lib/components/pri/common/warning.svelte";

  const promise = get("/api/pri/profile/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Set as default profile" />

{#await promise then profile}
  <SetDefault p={profile} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
