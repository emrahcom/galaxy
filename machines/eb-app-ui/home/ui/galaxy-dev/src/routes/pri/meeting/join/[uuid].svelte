<script lang="ts">
  import { page } from "$app/stores";
  import { join } from "$lib/pri/meeting";
  import Spinner from "$lib/components/common/spinner.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const promise = join($page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Join the meeting" />

{#await promise}
  <Spinner>joining...</Spinner>
{:then}
  <Spinner>joining...</Spinner>
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
