<script lang="ts">
  import { page } from "$app/stores";
  import { get } from "$lib/api";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Update from "$lib/components/pri/domain/update.svelte";
  import Warning from "$lib/components/common/warning.svelte";

  const promise = get("/api/pri/domain/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Update this Jitsi domain" />

{#await promise then domain}
  <Update p={domain} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
