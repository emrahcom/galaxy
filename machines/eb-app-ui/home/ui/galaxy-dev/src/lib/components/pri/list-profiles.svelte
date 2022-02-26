<script lang="ts">
  import type { Profile } from "$lib/types";

  export let profiles: Profile[];
</script>

<!-- -------------------------------------------------------------------------->
<section id="profiles">
  <div class="row mx-auto mt-2 g-2" style="max-width:1080px;">
    {#each profiles as p}
      <div class="col-sm-6 col-lg-4">
        <div class="card {!p.is_default ? 'border border-primary' : ''}">
          <div class="card-body text-center">
            <h5 class="card-title text-muted">{p.name}</h5>
            <p class="card-text text-muted">{p.email}</p>
          </div>

          <div class="card-footer bg-body text-center">
            <a
              href="/pri/profile/update/{p.id}"
              class="btn btn-outline-secondary btn-sm"
              role="button"
            >
              <i class="bi bi-pencil" />
            </a>

            {#if !p.is_default}
              <a
                href="/pri/profile/set/default/{p.id}"
                class="btn btn-outline-secondary btn-sm"
                role="button"
              >
                <i class="bi bi-check" />
              </a>
            {/if}

            <a
              href="/pri/profile/del/{p.id}"
              class="btn btn-outline-secondary btn-sm"
              role="button"
            >
              <i class="bi bi-trash" />
            </a>
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
