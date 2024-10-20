<script lang="ts">
  import type { Profile } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";
  import Set from "$lib/components/common/link-set-default-profile.svelte";
  import Update from "$lib/components/common/link-update.svelte";

  export let p: Profile;
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div class="card h-100 {p.is_default ? 'border-primary' : ''}">
    <div class="card-body text-center">
      <h5 class="card-title text-muted">{p.name}</h5>
      <p class="card-text text-muted">{p.email}</p>
    </div>

    <div class="card-footer bg-body border-0 text-center">
      {#if !p.is_default}
        <Del href="/pri/profile/del/{p.id}" />
        <Set href="/pri/profile/set/default/{p.id}" />
      {/if}

      <Update href="/pri/profile/update/{p.id}" />
    </div>
  </div>
</div>
