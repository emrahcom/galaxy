<script lang="ts">
  import { page } from "$app/stores";
  import { getById, listById } from "$lib/api";
  import type { Domain } from "$lib/types";
  import List from "$lib/components/pri/domain-partner/list.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const domainId = $page.params.domain_uuid || "";
  let domainName = $state("");

  const pr1 = getById("/api/pri/domain/get", domainId).then((item: Domain) => {
    domainName = item.name;
  });
  const pr2 = listById("/api/pri/domain/partner/list/bydomain", domainId, 100);
  const pr3 = listById(
    "/api/pri/domain/partner/candidate/list/bydomain",
    domainId,
    100,
  );
</script>

<!-- -------------------------------------------------------------------------->
<Subheader
  subheader="Partners of {domainName}"
  hrefAdd="/pri/domain/partner/candidate/add/{domainId}"
  hrefAddTitle="Add a new partner"
  hrefBack="/pri/domain"
/>

<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
{#await Promise.all([pr1, pr2, pr3]) then [_domain, partners, candidates]}
  <List {partners} {candidates} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
