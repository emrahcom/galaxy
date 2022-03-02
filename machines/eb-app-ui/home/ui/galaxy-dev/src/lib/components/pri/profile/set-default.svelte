<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { setDefault as setDefaultProfile } from "$lib/pri/profile";
  import type { Profile } from "$lib/types";
  import Cancel from "$lib/components/pri/common/button-cancel.svelte";
  import Email from "$lib/components/pri/common/form-email.svelte";
  import Submit from "$lib/components/pri/common/button-submit.svelte";
  import Text from "$lib/components/pri/common/form-text.svelte";
  import Warning from "$lib/components/pri/common/warning.svelte";

  export let warning = false;
  export let p: Profile;

  function cancel() {
    window.location.href = "/pri/profile";
  }

  async function onSubmit() {
    try {
      warning = false;

      await setDefaultProfile(p.id);
      window.location.href = "/pri/profile";
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="set-default">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text name="name" label="Name" value={p.name} readonly={true} />
      <Email
        name="email"
        label="Email"
        value={p.email || "-"}
        readonly={true}
      />

      {#if warning}
        <Warning>The set request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <Submit label="Set" />
      </div>
    </form>
  </div>
</section>
