<script lang="ts">
  import { MAX_WIDTH } from "$lib/config";
  import type { Profile } from "$lib/types";

  export let p: Profile;

  function cancel() {
    window.location.href = "/pri/profile";
  }

  function update() {
    console.log("update");
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="update">
  <div class="row mt-2 justify-content-center" style="max-width:{MAX_WIDTH};">
    <div class="col-sm-6 col-lg-4">
      <form on:submit|preventDefault={update}>
        <div class="form-floating my-3">
          <input
            type="text"
            id="name"
            class="form-control"
            name="name"
            placeholder="Name"
            value={p.name}
            required
          />
          <label for="name">Name</label>
        </div>

        <div class="form-floating my-3">
          <input
            type="email"
            id="email"
            class="form-control"
            name="email"
            placeholder="Email"
            value={p.email}
            required
          />
          <label for="email">Email</label>
        </div>

        <div class="d-flex gap-5 mt-5 justify-content-center">
          <button
            class="btn btn-outline-secondary"
            type="button"
            on:click={cancel}
          >
            Cancel
          </button>

          <button class="btn btn-outline-secondary" type="submit">
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
</section>
