<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Back from "$lib/components/common/button-on-click.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Wait from "$lib/components/pri/member-waiting/wait.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const membershipId = $page.params.membership_uuid;

  const pr = getById(
    "/api/pri/meeting/schedule/get/bymembership",
    membershipId,
  );

  // ---------------------------------------------------------------------------
  function goBack() {
    globalThis.location.href = `/pri/meeting`;
  }
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Welcome to the waiting room" />

{#await pr then schedule}
  <Wait p={schedule} />
{:catch}
  <Warning>No scheduled meeting found</Warning>

  <center>
    <Back label="Back" on:click={goBack} />
  </center>
{/await}
