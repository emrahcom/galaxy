<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Del from "$lib/components/pri/profile/del.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/profile/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Delete this meeting profile" />

{#await pr then profile}
  <Del p={profile} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
