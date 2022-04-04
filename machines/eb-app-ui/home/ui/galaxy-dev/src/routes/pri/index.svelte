<script lang="ts">
  import identity from "$lib/stores/kratos/identity";

  let profileName = "";

  const pr = get("/api/pri/profile/get/default")
    .then((item: Profile) => {
      profileName = item.profile_name;
    })
    .catch(() => {
      // do nothing
    });
</script>

<!-- -------------------------------------------------------------------------->
<section id="dashboard">
  <div class="row d-flex mt-5 justify-content-center">
    <div class="col mx-auto text-center" style="max-width:{FORM_WIDTH};">
      <h2 class="text-muted mb-5">Hello {profile_name}</h2>

      <h4 class="text-muted mb-5">
        Click
        <button
          class="btn btn-outline-primary"
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
