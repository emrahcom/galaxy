<script lang="ts">
  import { APP, FORM_WIDTH } from "$lib/config";
  import { get } from "svelte/store";
  import identity from "$lib/stores/kratos/identity";

  const _identity = get(identity);
</script>

<!-- -------------------------------------------------------------------------->
<section id="welcome">
  <div class="row d-flex mt-5 justify-content-center">
    <div class="col mx-auto text-center" style="max-width:{FORM_WIDTH};">
      <h2 class="text-muted mb-5">Welcome to {APP}</h2>

      <h4 class="text-muted mb-5">
        This site is for Fellow Jitsters to organize Jitsi meetings, meeting
        schedules and attendees.
      </h4>

      {#if !_identity}
        <h4 class="text-muted small mb-5">
          If you don't have an account yet, please
          <a class="text-primary" href="/id/registration">Sign Up</a>.
        </h4>
      {:else}
        <h5 class="text-muted mb-5">
          Click
          <button
            class="btn btn-sm btn-outline-primary mx-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
          >
            <span class="bi bi-list" />
          </button>
          to start.
        </h5>
      {/if}
    </div>
  </div>
</section>
