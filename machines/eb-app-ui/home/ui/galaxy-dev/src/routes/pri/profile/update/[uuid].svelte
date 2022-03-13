<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Update from "$lib/components/pri/profile/update.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/profile/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Update this meeting profile" />

{#await pr then profile}
  <Update p={profile} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
