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

  interface Props {
    p: Room;
  }

  let { p }: Props = $props();

  let warning = $state(false);
  let disabled = $state(false);

  const domain_name = $derived(
    p.domain_enabled ? p.domain_name : `${p.domain_name} - DISABLED`,
  );

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = "/pri/room";
  }

  // ---------------------------------------------------------------------------
  async function onsubmit() {
    try {
      warning = false;
      disabled = true;

      await actionById("/api/pri/room/del", p.id);
      globalThis.location.replace("/pri/room");
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="del">
  <div class="d-flex mt-2 justify-content-center">
    <form {onsubmit} style="width:{FORM_WIDTH};">
      <Text
        name="name"
        label="Name"
        value={p.name}
        disabled={true}
        readonly={true}
      />
      <Text
        name="domain_name"
        label="Jitsi Domain Name"
        value={domain_name}
        disabled={true}
        readonly={true}
      />
      <Text
        name="domain_url"
        label="Jitsi Domain URL"
        value={p.domain_url}
        disabled={true}
        readonly={true}
      />
      <Switch
        name="has_suffix"
        label="Use a randomly generated room identifier for added security"
        value={p.has_suffix}
        disabled={true}
      />

      {#if warning}
        <Warning>The delete request is not accepted.</Warning>
      {:else}
        <Warning>All meetings on this room will be deleted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel {disabled} onclick={cancel} />
        <SubmitBlocker />
        <Submit {disabled} label="Delete" />
      </div>
    </form>
  </div>
</section>
