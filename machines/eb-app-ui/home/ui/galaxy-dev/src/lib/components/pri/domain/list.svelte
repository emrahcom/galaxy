<script lang="ts">
  import type { DomainReduced } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Update from "$lib/components/common/link-update.svelte";

  export let domains: DomainReduced[];
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each domains as p}
      <div class="col-md-6 col-xl-4">
        <div class="card {!p.enabled ? 'border-danger' : ''}">
          <div class="card-body text-center">
            <h5 class="card-title text-muted">{p.name}</h5>
            <p class="card-text text-muted">{p.url}</p>
          </div>

          <div class="card-footer bg-body border-0 text-center">
            <Del href="/pri/domain/del/{p.id}" />

            {#if p.enabled}
              <Disable href="/pri/domain/disable/{p.id}" />
            {:else}
              <Enable href="/pri/domain/enable/{p.id}" />
            {/if}

            <Update href="/pri/domain/update/{p.id}" />
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
