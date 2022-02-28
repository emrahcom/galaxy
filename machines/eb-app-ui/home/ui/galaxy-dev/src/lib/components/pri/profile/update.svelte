<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import type { Profile } from "$lib/types";
  import Cancel from "$lib/components/pri/common/button-cancel.svelte";
  import Submit from "$lib/components/pri/common/button-submit.svelte";

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
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={update} style="width:{FORM_WIDTH};">
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
        <Cancel on:click={cancel} />
        <Submit label="Update" />
      </div>
    </form>
  </div>
</section>
