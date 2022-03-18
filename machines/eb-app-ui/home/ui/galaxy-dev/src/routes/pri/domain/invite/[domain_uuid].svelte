<script lang="ts">
  import { page } from "$app/stores";
  import { getById, listById } from "$lib/api";
  import type { Domain } from "$lib/types";
  import List from "$lib/components/pri/domain-invite/list.svelte";
  import Subheader from "$lib/components/common/subheader-pri-list.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const domainId = $page.params.domain_uuid;
  let domainName = "";

  const pr1 = getById("/api/pri/domain/get", domainId).then((item: Domain) => {
    domainName = item.name;
  });
  const pr2 = listById("/api/pri/domain/invite/list", domainId, 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader
  subheader="The partner keys for {domainName}"
  href="/pri/domain/invite/add/{domainId}"
/>

{#await Promise.all([pr1, pr2]) then [_domain, invites]}
  <List {invites} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
