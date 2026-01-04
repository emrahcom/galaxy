<script lang="ts">
  import { page } from "$app/stores";
  import { getById, listById } from "$lib/api";
  import type { Domain } from "$lib/types";
  import List from "$lib/components/pri/domain-invite/list.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const domainId = $page.params.domain_uuid || "";
  let domainName = $state("");

  const pr1 = getById("/api/pri/domain/get", domainId).then((item: Domain) => {
    domainName = item.name;
  });
  const pr2 = listById("/api/pri/domain/invite/list/bydomain", domainId, 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader
  subheader="Partner keys of {domainName}"
  hrefAdd="/pri/domain/invite/add/{domainId}"
  hrefAddTitle="Add a new partner key (partnership link)"
  hrefBack="/pri/domain"
/>

<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
{#await Promise.all([pr1, pr2]) then [_domain, invites]}
  <List {invites} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
