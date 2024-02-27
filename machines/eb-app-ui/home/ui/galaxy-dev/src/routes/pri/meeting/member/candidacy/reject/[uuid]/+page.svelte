<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Reject from "$lib/components/pri/meeting-member-candidacy/reject.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById(
    "/api/pri/meeting/member/candidacy/get",
    $page.params.uuid,
  );
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Reject membership" />

{#await pr then candidacy}
  <Reject p={candidacy} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
