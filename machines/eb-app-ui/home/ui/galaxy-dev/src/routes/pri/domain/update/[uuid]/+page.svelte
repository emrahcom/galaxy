<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Update from "$lib/components/pri/domain/update.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/domain/get", $page.params.uuid || "");
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Update this Jitsi domain" />

{#await pr then domain}
  <Update p={domain} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
