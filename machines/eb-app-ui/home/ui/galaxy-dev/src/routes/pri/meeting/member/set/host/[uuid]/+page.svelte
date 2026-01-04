<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import SetHost from "$lib/components/pri/meeting-member/set-host.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/meeting/member/get", $page.params.uuid || "");
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Set this member as host" />

{#await pr then member}
  <SetHost p={member} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
