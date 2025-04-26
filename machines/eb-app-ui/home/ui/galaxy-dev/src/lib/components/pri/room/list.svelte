<script lang="ts">
  import type { Room333, RoomPartnerCandidacy } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Candidacy from "$lib/components/pri/room/list-item-candidacy.svelte";
  import Item from "$lib/components/pri/room/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    rooms: Room333[];
    candidacies: RoomPartnerCandidacy[];
  }

  let { rooms, candidacies }: Props = $props();

  const isEmpty = !(rooms.length || candidacies.length);
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each rooms as p (p.id)}
      <Item {p} />
    {/each}

    {#each candidacies as p (p.id)}
      <Candidacy {p} />
    {/each}

    {#if isEmpty}
      <Warning>
        There is no room in the list. Click <Add href="/pri/room/add" /> to add a
        new room.
      </Warning>
    {/if}
  </div>
</section>
