<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Del from "$lib/components/pri/domain-partner-candidate/del.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById(
    "/api/pri/domain/partner/candidate/get",
    $page.params.uuid,
  );
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Delete partnership" />

{#await pr then candidate}
  <Del p={candidate} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
