<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Del from "$lib/components/pri/meeting-membership/del.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/meeting/membership/get", $page.params.id);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Unsubscribe from this meeting" />

{#await pr then membership}
  <Del p={membership} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
