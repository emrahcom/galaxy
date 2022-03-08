<script lang="ts">
  import { page } from "$app/stores";
  import { join } from "$lib/pri/room";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/warning.svelte";

  let promise = join($page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Join the meeting room" />

{#await promise}
  joining...
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
