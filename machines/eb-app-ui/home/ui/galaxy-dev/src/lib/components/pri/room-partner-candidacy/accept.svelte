<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { actionById } from "$lib/api";
  import type { RoomPartnerCandidacy } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: RoomPartnerCandidacy;

  let warning = false;

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = "/pri/room";
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      await actionById("/api/pri/room/partner/candidacy/accept", p.id);
      window.location.href = "/pri/room";
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="accept">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text
        name="room_name"
        label="Room"
        value={p.room_name}
        disabled={true}
        readonly={true}
      />
      <Text
        name="domain_name"
        label="Jitsi Domain Name"
        value={p.domain_name}
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

      {#if warning}
        <Warning>The accept request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Accept" />
      </div>
    </form>
  </div>
</section>
