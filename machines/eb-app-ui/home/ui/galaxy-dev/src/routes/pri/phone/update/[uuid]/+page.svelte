<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Update from "$lib/components/pri/phone/update.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/phone/get", $page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Update this virtual phone" />

{#await pr then phone}
  <Update p={phone} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
