<script lang="ts">
  import { page } from "$app/stores";
  import { getByCode } from "$lib/api";
  import Add from "$lib/components/pri/domain-partnership/add.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const code = $page.params.code;

  const pr1 = getByCode("/api/pri/domain/invite/get/bycode", code);
  const pr2 = getByCode("/api/pri/domain/partnership/check/bycode", code);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Add a partner domain" />

{#await pr1 then invite}
  <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
  {#await pr2 then _checked}
    <Add {invite} isExist={true} />
  {:catch}
    <Add {invite} isExist={false} />
  {/await}
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
