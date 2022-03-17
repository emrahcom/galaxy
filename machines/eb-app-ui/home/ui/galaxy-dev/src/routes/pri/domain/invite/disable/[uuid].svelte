<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Disable from "$lib/components/pri/domain-invite/disable.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/domain/invite/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Disable this partner key" />

{#await pr then invite}
  <Disable p={invite} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
