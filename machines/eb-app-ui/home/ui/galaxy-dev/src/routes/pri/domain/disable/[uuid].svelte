<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Disable from "$lib/components/pri/domain/disable.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const promise = getById("/api/pri/domain/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Disable this Jitsi domain" />

{#await promise then domain}
  <Disable p={domain} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
