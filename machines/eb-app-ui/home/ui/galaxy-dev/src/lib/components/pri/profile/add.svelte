<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/api";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Email from "$lib/components/common/form-email.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/warning.svelte";

  let warning = false;
  let p = {
    name: "",
    email: "",
  };

  function cancel() {
    window.location.href = "/pri/profile";
  }

  async function onSubmit() {
    try {
      warning = false;
      await action("/api/pri/profile/add", p);
      window.location.href = "/pri/profile";
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text name="name" label="Name" bind:value={p.name} required={true} />
      <Email name="email" label="Email" bind:value={p.email} required={false} />

      {#if warning}
        <Warning>
          The add request is not accepted. Please check your inputs.
        </Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <Submit label="Add" />
      </div>
    </form>
  </div>
</section>
