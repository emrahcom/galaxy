<script lang="ts">
  import type { Domain } from "$lib/types";
  import Del from "$lib/components/pri/common/link-del.svelte";
  import Disable from "$lib/components/pri/common/link-disable.svelte";
  import Enable from "$lib/components/pri/common/link-enable.svelte";
  import Update from "$lib/components/pri/common/link-update.svelte";

  export let domains: Domain[];
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each domains as p}
      <div class="col-sm-6 col-lg-4 col-xxl-3">
        <div class="card {!p.enabled ? 'border border-danger' : ''}">
          <div class="card-body text-center">
            <h5 class="card-title text-muted">{p.name}</h5>
            <p class="card-text text-muted">{"-"}</p>
          </div>

          <div class="card-footer bg-body text-center">
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
