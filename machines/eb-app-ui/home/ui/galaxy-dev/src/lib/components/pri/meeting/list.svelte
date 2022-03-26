<script lang="ts">
  import type { MeetingReduced } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Invite from "$lib/components/common/link-invite.svelte";
  import Join from "$lib/components/common/link-join.svelte";
  import People from "$lib/components/common/link-people.svelte";
  import Update from "$lib/components/common/link-update.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let meetings: MeetingReduced[];
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each meetings as p}
      <div class="col-md-6 col-xl-4">
        <div
          class="card h-100 {p.enabled && p.chain_enabled
            ? ''
            : 'border-danger'}"
        >
          <div class="card-body text-center">
            <h5 class="card-title text-muted">{p.name}</h5>

            <p class="card-text text-muted small">{p.ownership}</p>

            {#if p.ownership === "private"}
              <p class="card-text text-muted small">
                {#if p.schedule_type === "ephemeral"}
                  {`${p.domain_name}`}
                {:else}
                  {`${p.room_name} on ${p.domain_name}`}
                {/if}
              </p>
            {/if}

            <p class="card-text text-muted">{p.info}</p>
          </div>

          <div class="card-footer bg-body border-0 text-center">
            {#if p.ownership === "private"}
              <Del href="/pri/meeting/del/{p.id}" />

              {#if p.enabled}
                <Disable href="/pri/meeting/disable/{p.id}" />
              {:else}
                <Enable href="/pri/meeting/enable/{p.id}" />
              {/if}

              <Update href="/pri/meeting/update/{p.id}" />
              <Invite href="/pri/meeting/invite/{p.id}" />

              {#if p.schedule_type !== "ephemeral"}
                <People href="/pri/meeting/member/{p.id}" />
              {/if}

              {#if p.chain_enabled}
                <Join href="/pri/meeting/join/{p.id}" />
              {/if}
            {:else if p.ownership === "member"}
              <Del href="/pri/meeting/membership/del/{p.membership_id}" />
              <Update
                href="/pri/meeting/membership/update/{p.membership_id}"
              />

              {#if p.enabled && p.chain_enabled}
                <Join href="/pri/meeting/join/{p.id}" />
              {/if}
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <Warning>No meeting found</Warning>
    {/each}
  </div>
</section>
