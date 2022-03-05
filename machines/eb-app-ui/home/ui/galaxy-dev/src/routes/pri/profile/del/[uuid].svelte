<script lang="ts">
  import { page } from "$app/stores";
  import { get } from "$lib/api";
  import Del from "$lib/components/pri/profile/del.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/warning.svelte";

  const promise = get("/api/pri/profile/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Delete this meeting profile" />

{#await promise then profile}
  <Del p={profile} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
