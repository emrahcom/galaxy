<script lang="ts">
  import { page } from "$app/stores";
  import { join } from "$lib/pri/meeting";
  import Info from "$lib/components/common/alert-info.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  let promise = join($page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Join the meeting" />

{#await promise}
  <Info>joining...</Info>
{:then}
  <Info>joining...</Info>
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
