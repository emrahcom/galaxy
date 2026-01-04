<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Del from "$lib/components/pri/identity-key/del.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/identity/key/get", $page.params.uuid || "");
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Delete this private key" />

{#await pr then key}
  <Del p={key} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
