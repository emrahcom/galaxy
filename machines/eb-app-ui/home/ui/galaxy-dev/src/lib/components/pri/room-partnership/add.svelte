<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/api";
  import type { RoomInvite111 } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    invite: RoomInvite111;
    isExist: boolean;
  }

  let { invite, isExist }: Props = $props();

  let warning = $state(false);
  let disabled = $state(false);
  let p = $state({
    code: invite.code,
  });

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = `/pri/room`;
  }

  // ---------------------------------------------------------------------------
  async function onsubmit() {
    try {
      warning = false;
      disabled = true;

      await action("/api/pri/room/partnership/add/bycode", p);
      globalThis.location.href = `/pri/room`;
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  <div class="d-flex mt-2 justify-content-center">
    <form {onsubmit} style="width:{FORM_WIDTH};">
      <Text
        name="room_name"
        label="Room"
        value={invite.room_name}
        disabled={true}
        readonly={true}
      />
      <Text
        name="domain_name"
        label="Jitsi Domain Name"
        value={invite.domain_name}
        disabled={true}
        readonly={true}
      />
      <Text
        name="domain_url"
        label="Jitsi Domain URL"
        value={invite.domain_url}
        disabled={true}
        readonly={true}
      />

      {#if warning}
        <Warning>The add request is not accepted.</Warning>
      {/if}

      {#if isExist}
        <Warning>
          This room is already in your list.<br />
          Nothing to do.
        </Warning>

        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Cancel label="Abort" onclick={cancel} />
        </div>
      {:else}
        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Cancel {disabled} onclick={cancel} />
          <SubmitBlocker />
          <Submit {disabled} label="Add" />
        </div>
      {/if}
    </form>
  </div>
</section>
