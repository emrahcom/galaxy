<script lang="ts">
  import { page } from "$app/stores";
  import { getByCode } from "$lib/api";
  import Add from "$lib/components/pri/meeting-membership/add.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const code = $page.params.code;

  const pr = getByCode("/api/pri/meeting/invite/get/bycode", code);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Subscribe to this meeting" />

{#await pr then invite}
  <Add {invite} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
