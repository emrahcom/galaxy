<script lang="ts">
  import { page } from "$app/stores";
  import { get } from "$lib/api";
  import Subheader from "$lib/components/pri/common/subheader.svelte";
  import Update from "$lib/components/pri/profile/update.svelte";
  import Warning from "$lib/components/pri/common/warning.svelte";

  const promise = get("/api/pri/profile/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Update this meeting profile" />

{#await promise then profile}
  <Update p={profile} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
