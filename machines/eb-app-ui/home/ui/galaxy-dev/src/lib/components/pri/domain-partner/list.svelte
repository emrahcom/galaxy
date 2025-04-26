<script lang="ts">
  import type { DomainPartner, DomainPartnerCandidate } from "$lib/types";
  import Candidate from "$lib/components/pri/domain-partner/list-item-candidate.svelte";
  import Item from "$lib/components/pri/domain-partner/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    partners: DomainPartner[];
    candidates: DomainPartnerCandidate[];
  }

  let { partners, candidates }: Props = $props();

  const isEmpty = !(partners.length || candidates.length);
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each partners as p (p.id)}
      <Item {p} />
    {/each}

    {#each candidates as p (p.id)}
      <Candidate {p} />
    {/each}

    {#if isEmpty}
      <Warning>This domain does not have a partner.</Warning>
    {/if}
  </div>
</section>
