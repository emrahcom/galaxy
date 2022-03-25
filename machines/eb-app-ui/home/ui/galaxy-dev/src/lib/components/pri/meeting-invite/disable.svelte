<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { actionById } from "$lib/api";
  import {
    INVITE_TYPE_OPTIONS,
    AFFILIATION_OPTIONS,
  } from "$lib/pri/meeting-invite";
  import type { MeetingInvite } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Radio from "$lib/components/common/form-radio.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Switch from "$lib/components/common/form-switch.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: MeetingInvite;

  let warning = false;

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = `/pri/meeting/invite/${p.meeting_id}`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      await actionById("/api/pri/meeting/invite/disable", p.id);
      window.location.href = `/pri/meeting/invite/${p.meeting_id}`;
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="disable">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text name="name" label="Name" value={p.name} readonly={true} />
      <Text
        name="meeting_name"
        label="Meeting"
        value={p.meeting_name}
        readonly={true}
      />

      <p class="text-muted me-3 mt-3 mb-1">Allow to become</p>
      <Radio
        bind:value={p.invite_type}
        options={INVITE_TYPE_OPTIONS}
        disabled={true}
      />

      <p class="text-muted me-3 mt-3 mb-1">Allow to join as</p>
      <Radio
        bind:value={p.join_as}
        options={AFFILIATION_OPTIONS}
        disabled={true}
      />

      {#if p.invite_type === "member"}
        <p class="text-muted me-3 mt-3 mb-1" />
        <Switch
          name="disposable"
          label="Disposable"
          desc="(can only be used once)"
          bind:value={p.disposable}
          disabled={true}
        />
      {/if}

      {#if warning}
        <Warning>The disable request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Disable" />
      </div>
    </form>
  </div>
</section>
