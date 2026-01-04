<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Del from "$lib/components/pri/domain/del.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/domain/get", $page.params.uuid || "");
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Delete this Jitsi domain" />

{#await pr then domain}
  <Del p={domain} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
