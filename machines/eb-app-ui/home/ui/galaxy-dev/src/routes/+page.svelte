<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";

  const identity_id = globalThis.localStorage.getItem("identity_id");
</script>

<!-- -------------------------------------------------------------------------->
<section id="welcome">
  <div class="row d-flex mt-5 justify-content-center">
    <div class="col mx-auto text-center" style="max-width:{FORM_WIDTH};">
      <h2 class="text-muted mb-5">Welcome</h2>

      <h4 class="text-muted mb-5">
        This site is for Fellow Jitsters to organize Jitsi meetings, meeting
        schedules and attendees.
      </h4>

      {#if identity_id}
        <h5 class="text-muted mb-5">
          Click
          <button
            class="btn btn-sm btn-outline-primary mx-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
          >
            <i class="bi bi-list"></i>
          </button>
          to start.
        </h5>
      {:else}
        <h4 class="text-muted small mb-5">
          If you don't have an account yet, please
          <a class="text-primary" href="/id/registration">Sign Up</a>
        </h4>
      {/if}
    </div>
  </div>
</section>
