<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Update from "$lib/components/pri/identity-key/update.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/identity/key/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Update this private key" />

{#await pr then key}
  <Update p={key} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
