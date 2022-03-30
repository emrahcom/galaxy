<script lang="ts">
  import type { RoomPartner } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let partners: RoomPartner[];
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each partners as p}
      <div class="col-md-6 col-xl-4">
        <div class="card h-100 {p.enabled ? '' : 'border-danger'}">
          <div class="card-body text-center">
            <h5 class="card-title text-muted">{p.profile_name}</h5>

            <p class="card-text text-muted">
              {p.profile_email}
            </p>
          </div>

          <div class="card-footer bg-body border-0 text-center">
            <Del href="/pri/room/partner/del/{p.id}" />

            {#if p.enabled}
              <Disable href="/pri/room/partner/disable/{p.id}" />
            {:else}
              <Enable href="/pri/room/partner/enable/{p.id}" />
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <Warning>This room has no partner.</Warning>
    {/each}
  </div>
</section>
