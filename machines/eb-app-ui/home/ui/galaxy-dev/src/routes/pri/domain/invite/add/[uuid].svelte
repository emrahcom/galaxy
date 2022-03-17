<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Add from "$lib/components/pri/domain-invite/add.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const uuid = $page.params.uuid;

  const pr = getById("/api/pri/domain/get", uuid);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Add a partner key" />

{#await pr then domain}
  <Add {domain} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
