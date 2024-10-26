<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { actionById } from "$lib/api";
  import type { RoomPartner } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    p: RoomPartner;
  }

  let { p }: Props = $props();

  let warning = $state(false);
  let disabled = $state(false);

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = `/pri/room/partner/${p.room_id}`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      disabled = true;

      await actionById("/api/pri/room/partner/enable", p.id);
      globalThis.location.href = `/pri/room/partner/${p.room_id}`;
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="enable">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text
        name="name"
        label="Name"
        value={p.contact_name || p.profile_name || ""}
        disabled={true}
        readonly={true}
      />
      <Text
        name="email"
        label="Email"
        value={p.profile_email || ""}
        disabled={true}
        readonly={true}
      />

      {#if warning}
        <Warning>The enable request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel {disabled} on:click={cancel} />
        <SubmitBlocker />
        <Submit {disabled} label="Enable" />
      </div>
    </form>
  </div>
</section>
