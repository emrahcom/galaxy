<script lang="ts">
  import type { RoomPartner, RoomPartnerCandidate } from "$lib/types";
  import Candidate from "$lib/components/pri/room-partner/list-item-candidate.svelte";
  import Item from "$lib/components/pri/room-partner/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    partners: RoomPartner[];
    candidates: RoomPartnerCandidate[];
  }

  let { partners, candidates }: Props = $props();

  const isEmpty = !(partners.length || candidates.length);
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each partners as p}
      <Item {p} />
    {/each}

    {#each candidates as p}
      <Candidate {p} />
    {/each}

    {#if isEmpty}
      <Warning>This room does not have a partner.</Warning>
    {/if}
  </div>
</section>
