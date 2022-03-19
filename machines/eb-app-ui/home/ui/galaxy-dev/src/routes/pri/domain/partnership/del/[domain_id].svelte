<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Del from "$lib/components/pri/domain-partnership/del.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr = getById(
    "/api/pri/domain/partnership/get/bydomain",
    $page.params.domain_id,
  );
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Delete this partner domain" />

{#await pr then partnership}
  <Del p={partnership} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
