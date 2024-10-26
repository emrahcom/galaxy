<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/api";
  import type { Profile } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Email from "$lib/components/common/form-email.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    p: Profile;
  }

  let { p }: Props = $props();

  let warning = $state(false);
  let disabled = $state(false);

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = "/pri/profile";
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      disabled = true;

      await action("/api/pri/profile/update", p);
      globalThis.location.href = "/pri/profile";
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="update">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text name="name" label="Name" bind:value={p.name} required={true} />
      <Email
        name="email"
        label="Email (optional)"
        bind:value={p.email}
        required={false}
      />

      {#if warning}
        <Warning>
          The update request is not accepted. Please check your inputs.
        </Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel {disabled} on:click={cancel} />
        <SubmitBlocker />
        <Submit {disabled} label="Update" />
      </div>
    </form>
  </div>
</section>
