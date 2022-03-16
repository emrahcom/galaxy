<script lang="ts">
  import { page } from "$app/stores";
  import { getById, listById } from "$lib/api";
  import List from "$lib/components/pri/domain-invite/list.svelte";
  import Subheader from "$lib/components/common/subheader-pri-list.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const uuid = $page.params.uuid;

  const pr1 = getById("/api/pri/domain/get", uuid);
  const pr2 = list("/api/pri/domain/invite/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
{#await Promise.all([pr1, pr2]) then [domain, invites]}
  <Subheader
    subheader="The partner keys for ${domain.name}"
    href="/pri/domain/invite/add/{uuid}"
  />

  <List {invites} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
