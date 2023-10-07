<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { actionById } from "$lib/api";
  import type { Room } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Switch from "$lib/components/common/form-switch.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: Room;

  let warning = false;

  if (!p.domain_enabled) {
    p.domain_name = `${p.domain_name} - DISABLED`;
  }

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = "/pri/room";
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      await actionById("/api/pri/room/disable", p.id);
      window.location.href = "/pri/room";
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="disable">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text
        name="name"
        label="Name"
        value={p.name}
        disabled={true}
        readonly={true}
      />
      <Text
        name="domain"
        label="Jitsi Domain"
        value={p.domain_name}
        disabled={true}
        readonly={true}
      />
      <Switch
        name="has_suffix"
        label="Enable unpredictable room name generator"
        value={p.has_suffix}
        disabled={true}
      />

      {#if warning}
        <Warning>The disable request is not accepted.</Warning>
      {:else}
        <Warning>All meetings on this room will be disabled.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Disable" />
      </div>
    </form>
  </div>
</section>
