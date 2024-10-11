<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { actionById } from "$lib/api";
  import type { MeetingMembership } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Textarea from "$lib/components/common/form-textarea.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: MeetingMembership;

  let warning = false;
  let disabled = false;
  let profile: string;

  if (p.profile_email) {
    profile = `${p.profile_name || ""} (${p.profile_email})`;
  } else {
    profile = p.profile_name || "";
  }

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = `/pri/meeting`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      disabled = true;

      await actionById("/api/pri/meeting/membership/del", p.id);
      globalThis.location.replace(`/pri/meeting`);
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="del">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text
        name="meeting_name"
        label="Meeting"
        value={p.meeting_name}
        disabled={true}
        readonly={true}
      />
      <Textarea
        name="meeting_info"
        label="Info"
        value={p.meeting_info}
        disabled={true}
        readonly={true}
      />
      <Text
        name="profile"
        label="Profile"
        value={profile}
        disabled={true}
        readonly={true}
      />

      {#if warning}
        <Warning>The unsubscribe request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel bind:disabled on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Unsubscribe" bind:disabled />
      </div>
    </form>
  </div>
</section>
