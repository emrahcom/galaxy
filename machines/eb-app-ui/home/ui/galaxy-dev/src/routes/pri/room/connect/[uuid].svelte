<script lang="ts">
  import { page } from "$app/stores";
  import { connect } from "$lib/pri/room";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/warning.svelte";

  let promise = connect($page.params.uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Connect the meeting room" />

{#await promise}
  connecting...
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
