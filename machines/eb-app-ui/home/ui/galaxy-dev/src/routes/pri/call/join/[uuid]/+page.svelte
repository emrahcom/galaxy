<script lang="ts">
  import { page } from "$app/stores";
  import { actionById } from "$lib/api";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const msgId = $page.params.uuid;
  const pr = actionById("/api/pri/intercom/set/accepted", msgId);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Joining the call" />

{#await pr}
  redirecting...
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
