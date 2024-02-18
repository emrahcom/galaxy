<script lang="ts">
  import type { Contact } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";
  import Update from "$lib/components/common/link-update.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let contacts: Contact[];
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each contacts as p}
      <div class="col-md-6 col-xl-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title text-muted">{p.name}</h5>
            <p class="card-text text-muted"></p>
            <p class="card-text text-muted">
              {p.profile_name}<br />
              {p.profile_email}
            </p>
          </div>

          <div class="card-footer bg-body border-0 text-center">
            <Del href="/pri/contact/del/{p.id}" />
            <Update href="/pri/contact/update/{p.id}" />
          </div>
        </div>
      </div>
    {:else}
      <Warning>There is no contact in the list.</Warning>
    {/each}
  </div>
</section>
