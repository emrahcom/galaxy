<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { get } from "$lib/api";
  import identity from "$lib/stores/kratos/identity";

  let profileName = "";

  const pr = get("/api/pri/profile/get/default")
    .then((item: Profile) => {
      profileName = item.name.charAt(0).toUpperCase() + item.name.slice(1);
    })
    .catch(() => {
      // do nothing
    });
</script>

<!-- -------------------------------------------------------------------------->
<section id="dashboard">
  <div class="row d-flex mt-5 justify-content-center">
    <div class="col mx-auto text-center" style="max-width:{FORM_WIDTH};">
      <h2 class="text-muted mb-5">Hello {profileName}</h2>

      <h4 class="text-muted mb-5">
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
      </h4>
    </div>
  </div>
</section>
