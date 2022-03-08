<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Del from "$lib/components/pri/domain/del.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const promise = getById("/api/pri/domain/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Delete this Jitsi domain" />

{#await promise then domain}
  <Del p={domain} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
