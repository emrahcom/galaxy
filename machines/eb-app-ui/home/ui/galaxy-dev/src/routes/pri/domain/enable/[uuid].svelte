<script lang="ts">
  import { page } from "$app/stores";
  import { get } from "$lib/pri/api";
  import Enable from "$lib/components/pri/domain/enable.svelte";
  import Subheader from "$lib/components/pri/common/subheader.svelte";
  import Warning from "$lib/components/pri/common/warning.svelte";

  const promise = get("/api/pri/domain/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Enable this Jitsi domain" />

{#await promise then domain}
  <Enable p={domain} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
