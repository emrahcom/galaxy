<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Accept from "$lib/components/pri/room-partner-candidacy/accept.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById(
    "/api/pri/room/partner/candidacy/get",
    $page.params.uuid || "",
  );
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Accept partnership" />

{#await pr then candidacy}
  <Accept p={candidacy} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
