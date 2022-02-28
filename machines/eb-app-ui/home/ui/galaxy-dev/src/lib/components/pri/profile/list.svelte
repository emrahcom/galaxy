<script lang="ts">
  import type { Profile } from "$lib/types";
  import Check from "$lib/components/pri/common/button-check.svelte";
  import Del from "$lib/components/pri/common/button-del.svelte";
  import Update from "$lib/components/pri/common/button-update.svelte";

  export let profiles: Profile[];
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-2">
    {#each profiles as p}
      <div class="col-sm-6 col-lg-4">
        <div class="card {p.is_default ? 'border border-primary' : ''}">
          <div class="card-body text-center">
            <h5 class="card-title text-muted">{p.name}</h5>
            <p class="card-text text-muted">{p.email}</p>
          </div>

          <div class="card-footer bg-body text-center">
            <Del href="/pri/profile/del/{p.id}" />

            {#if !p.is_default}
              <Check href="/pri/profile/set/default/{p.id}" />
            {/if}

            <Update href="/pri/profile/update/{p.id}" />
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
