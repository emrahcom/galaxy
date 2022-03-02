<script lang="ts">
  import type { Profile } from "$lib/types";
  import Del from "$lib/components/pri/common/link-del.svelte";
  import Set from "$lib/components/pri/common/link-set-default-profile.svelte";
  import Update from "$lib/components/pri/common/link-update.svelte";

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
            {#if !p.is_default}
              <Del href="/pri/profile/del/{p.id}" />
              <Set href="/pri/profile/set/default/{p.id}" />
            {/if}

            <Update href="/pri/profile/update/{p.id}" />
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
