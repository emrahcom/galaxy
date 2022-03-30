<script lang="ts">
  import type { RoomReduced } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Invite from "$lib/components/common/link-invite.svelte";
  import Join from "$lib/components/common/link-join.svelte";
  import People from "$lib/components/common/link-people.svelte";
  import Update from "$lib/components/common/link-update.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let rooms: RoomReduced[];
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each rooms as p}
      <div class="col-md-6 col-xl-4">
        <div
          class="card h-100 {p.enabled && p.chain_enabled
            ? ''
            : 'border-danger'}"
        >
          <div class="card-body text-center">
            <h5 class="card-title text-muted">{p.name}</h5>
            <p class="card-text text-muted">{p.domain_name}</p>
            <p class="card-text text-muted small">{p.ownership}</p>
          </div>

          <div class="card-footer bg-body border-0 text-center">
            {#if p.ownership === "private"}
              <Del href="/pri/room/del/{p.id}" />

              {#if p.enabled}
                <Disable href="/pri/room/disable/{p.id}" />
              {:else}
                <Enable href="/pri/room/enable/{p.id}" />
              {/if}

              <Update href="/pri/room/update/{p.id}" />
              <Invite href="/pri/room/invite/{p.id}" />
              <People href="/pri/room/partner/{p.id}" />

              {#if p.chain_enabled}
                <Join href="/pri/room/join/{p.id}" />
              {/if}
            {:else if p.ownership === "partner"}
              <Del href="/pri/room/partnership/del/{p.partnership_id}" />

              {#if p.enabled && p.chain_enabled}
                <Join href="/pri/room/join/{p.id}" />
              {/if}
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <Warning>
        There is no room in the list. Click <Add href="/pri/room/add" /> to add
        a new room.
      </Warning>
    {/each}
  </div>
</section>
