<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Add from "$lib/components/pri/domain-partner-candidate/add.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const domainId = $page.params.domain_uuid;

  const pr = getById("/api/pri/domain/get", domainId);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Invite contact to partnership" />

{#await pr then domain}
  <Add {domain} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
