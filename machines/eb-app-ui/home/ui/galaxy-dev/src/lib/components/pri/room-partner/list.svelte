<script lang="ts">
  import type { RoomPartner, RoomPartnerCandidate } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let partners: RoomPartner[];
  export let candidates: RoomPartnerCandidate[];

  const isEmpty = !(partners.length || candidates.length);
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each partners as p}
      <div class="col-md-6 col-xl-4">
        <div class="card h-100 {p.enabled ? '' : 'border-danger'}">
          <div class="card-body text-center">
            <h5 class="card-title text-muted">
              {p.contact_name || p.profile_name}
            </h5>

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
    {/each}

    {#each candidates as c}
      <div class="col-md-6 col-xl-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title text-muted">
              {c.contact_name || c.profile_name}
            </h5>

            <p class="card-text text-muted">
              {c.profile_email}
            </p>

            {#if c.status == "pending"}
              <p class="card-text fw-bold text-success">pending</p>
            {:else}
              <p class="card-text fw-bold text-warning">rejected</p>
            {/if}
          </div>

          <div class="card-footer bg-body border-0 text-center">
            {#if c.status == "pending"}
              <Del href="/pri/room/partner/candidate/del/{c.id}" />
            {/if}
          </div>
        </div>
      </div>
    {/each}

    {#if isEmpty}
      <Warning>This room has no partner.</Warning>
    {/if}
  </div>
</section>
