<script lang="ts">
  import { page } from "$app/stores";
  import { getByCode } from "$lib/api";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const code = $page.params.code;

  const pr = getByCode("/api/pub/meeting/get/bycode", code);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Welcome to the meeting" />

{#await pr then meeting}
  {console.log(meeting)}
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
