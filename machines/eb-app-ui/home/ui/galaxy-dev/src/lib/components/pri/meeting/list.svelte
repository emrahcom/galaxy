<script lang="ts">
  import type { Meeting } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Join from "$lib/components/common/link-join.svelte";
  import Update from "$lib/components/common/link-update.svelte";

  export let meetings: Meeting[];
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each meetings as p}
      <div class="col-md-6 col-xl-4">
        <div class="card h-100 {!p.chain_enabled ? 'border-danger' : ''}">
          <div class="card-body text-center">
            <h5 class="card-title text-muted">{p.name}</h5>

            <p class="card-text text-muted small">
              {#if p.schedule_type === "ephemeral"}
                {`${p.domain_name}`}
              {:else}
                {`${p.room_name} on ${p.domain_name}`}
              {/if}
            </p>

            <p class="card-text text-muted">{p.info}</p>
          </div>

          <div class="card-footer bg-body border-0 text-center">
            <Del href="/pri/meeting/del/{p.id}" />

            {#if p.enabled}
              <Disable href="/pri/meeting/disable/{p.id}" />
            {:else}
              <Enable href="/pri/meeting/enable/{p.id}" />
            {/if}

            <Update href="/pri/meeting/update/{p.id}" />
            <Join href="/pri/meeting/join/{p.id}" />
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
