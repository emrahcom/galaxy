<script lang="ts">
  import { page } from "$app/stores";
  import { getByCode } from "$lib/api";
  import Add from "$lib/components/pri/room-partnership/add.svelte";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const code = $page.params.code;

  const pr1 = getByCode("/api/pri/room/invite/get/bycode", code);
  const pr2 = getByCode("/api/pri/room/partnership/check/bycode", code);

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = `/pri/room`;
  }
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Add a partner room" />

{#await pr1 then invite}
  <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
  {#await pr2 then _checked}
    <Add {invite} isExist={true} />
  {:catch}
    <Add {invite} isExist={false} />
  {/await}
{:catch}
  <Warning>
    Something went wrong.<br />
    Are you sure this link is valid and not expired?
  </Warning>

  <div class="d-flex gap-5 mt-5 justify-content-center">
    <Cancel label="Abort" on:click={cancel} />
  </div>
{/await}
