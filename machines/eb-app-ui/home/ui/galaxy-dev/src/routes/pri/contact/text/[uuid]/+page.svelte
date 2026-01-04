<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Text from "$lib/components/pri/contact/text.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById("/api/pri/contact/get", $page.params.uuid || "");
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Send message to this contact" />

{#await pr then contact}
  <Text p={contact} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
