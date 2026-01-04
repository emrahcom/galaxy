<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Update from "$lib/components/pri/meeting-schedule/update.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/meeting/schedule/get", $page.params.uuid || "");
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Update this schedule" />

{#await pr then schedule}
  <Update p={schedule} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
