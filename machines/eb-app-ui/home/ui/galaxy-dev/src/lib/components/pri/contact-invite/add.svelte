<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/api";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Switch from "$lib/components/common/form-switch.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const date = new Date();

  let warning = false;
  let disabled = false;
  let p = {
    name: `invite-${date.getTime() % 10000000000}`,
    disposable: true,
  };

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = "/pri/contact/invite";
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      disabled = true;

      await action("/api/pri/contact/invite/add", p);
      globalThis.location.href = "/pri/contact/invite";
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text name="name" label="Name" bind:value={p.name} required={true} />

      <p class="text-muted me-3 mt-3 mb-1" />
      <Switch
        name="disposable"
        label="Disposable"
        desc="(can only be used once)"
        bind:value={p.disposable}
      />

      {#if warning}
        <Warning>
          The create request is not accepted. Please check your inputs.
        </Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel bind:disabled on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Create" bind:disabled />
      </div>
    </form>
  </div>
</section>
