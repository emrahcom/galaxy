<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Disable from "$lib/components/pri/meeting-member/disable.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/meeting/member/get", $page.params.uuid || "");
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Disable this member" />

{#await pr then member}
  <Disable p={member} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
