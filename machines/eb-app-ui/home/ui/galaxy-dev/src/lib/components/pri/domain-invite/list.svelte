<script lang="ts">
  import { page } from "$app/stores";
  import type { DomainInvite } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Item from "$lib/components/pri/domain-invite/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let invites: DomainInvite[];
  const domain_id = $page.params.domain_uuid;
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each invites as p}
      <Item {p} />
    {:else}
      <Warning>
        This domain does not have a partner key. Click
        <Add href="/pri/domain/invite/add/{domain_id}" /> to create a new partner
        key and share it with your partner.
      </Warning>
    {/each}
  </div>
</section>
