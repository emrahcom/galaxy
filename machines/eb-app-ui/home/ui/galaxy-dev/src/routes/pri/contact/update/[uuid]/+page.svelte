<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Update from "$lib/components/pri/contact/update.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/contact/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Update this contact" />

{#await pr then contact}
  <Update p={contact} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
