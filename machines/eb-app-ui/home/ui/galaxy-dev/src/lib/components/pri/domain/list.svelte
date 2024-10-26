<script lang="ts">
  import type { Domain333, DomainPartnerCandidacy } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Candidacy from "$lib/components/pri/domain/list-item-candidacy.svelte";
  import Item from "$lib/components/pri/domain/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    domains: Domain333[];
    candidacies: DomainPartnerCandidacy[];
  }

  let { domains, candidacies }: Props = $props();

  const isEmpty = !(domains.length || candidacies.length);
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each domains as p}
      <Item {p} />
    {/each}

    {#each candidacies as p}
      <Candidacy {p} />
    {/each}

    {#if isEmpty}
      <Warning>
        There is no domain in the list. Click <Add href="/pri/domain/add" /> to add
        a new domain.
      </Warning>
    {/if}
  </div>
</section>
