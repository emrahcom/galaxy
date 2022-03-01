<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { update as updateProfile } from "$lib/pri/profile";
  import type { Profile } from "$lib/types";
  import Cancel from "$lib/components/pri/common/button-cancel.svelte";
  import Email from "$lib/components/pri/common/form-email.svelte";
  import Submit from "$lib/components/pri/common/button-submit.svelte";
  import Text from "$lib/components/pri/common/form-text.svelte";

  export let p: Profile;

  function cancel() {
    window.location.href = "/pri/profile";
  }

  function update() {
    try {
      updateProfile(p);
      window.location.href = "/pri/profile";
    } catch {
      console.log("error");
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="update">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={update} style="width:{FORM_WIDTH};">
      <Text name="name" label="Name" bind:value={p.name} required={true} />
      <Email name="email" label="Email" bind:value={p.email} required={false} />

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <Submit label="Update" />
      </div>
    </form>
  </div>
</section>
