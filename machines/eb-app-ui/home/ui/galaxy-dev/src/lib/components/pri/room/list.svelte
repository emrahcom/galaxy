<script lang="ts">
  import type { RoomReduced } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Join from "$lib/components/common/link-join.svelte";
  import Update from "$lib/components/common/link-update.svelte";

  export let rooms: RoomReduced[];
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each rooms as p}
      <div class="col-md-6 col-xl-4">
        <div class="card h-100 {!p.chain_enabled ? 'border-danger' : ''}">
          <div class="card-body text-center">
            <h5 class="card-title text-muted">{p.name}</h5>
            <p class="card-text text-muted">{p.domain_name}</p>
          </div>

          <div class="card-footer bg-body border-0 text-center">
            <Del href="/pri/room/del/{p.id}" />

            {#if p.enabled}
              <Disable href="/pri/room/disable/{p.id}" />
            {:else}
              <Enable href="/pri/room/enable/{p.id}" />
            {/if}

            <Update href="/pri/room/update/{p.id}" />
            <Join href="/pri/room/join/{p.id}" />
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
