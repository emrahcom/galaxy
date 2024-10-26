<script lang="ts">
  import { page } from "$app/stores";
  import type { RoomInvite } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Item from "$lib/components/pri/room-invite/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    invites: RoomInvite[];
  }

  let { invites }: Props = $props();

  const room_id = $page.params.room_uuid;
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each invites as p}
      <Item {p} />
    {:else}
      <Warning>
        This room does not have a partner key. Click
        <Add href="/pri/room/invite/add/{room_id}" /> to create a new partner key
        and share it with your partner.
      </Warning>
    {/each}
  </div>
</section>
