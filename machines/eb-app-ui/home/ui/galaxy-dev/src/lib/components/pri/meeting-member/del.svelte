<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { actionById } from "$lib/api";
  import type { MeetingMember } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: MeetingMember;

  let warning = false;

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = `/pri/meeting/member/${p.meeting_id}`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      await actionById("/api/pri/meeting/member/del", p.id);
      window.location.replace(`/pri/meeting/member/${p.meeting_id}`);
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="del">
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
      <Text
        name="type"
        label="Type"
        value={p.join_as}
        disabled={true}
        readonly={true}
      />

      {#if warning}
        <Warning>The delete request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Delete" />
      </div>
    </form>
  </div>
</section>
