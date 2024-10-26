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

  let warning = $state(false);
  let disabled = $state(false);

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = `/pri/meeting/invite/${p.meeting_id}`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      disabled = true;

      await actionById("/api/pri/meeting/invite/del", p.id);
      globalThis.location.replace(`/pri/meeting/invite/${p.meeting_id}`);
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
        name="name"
        label="Name"
        value={p.name}
        disabled={true}
        readonly={true}
      />
      <Text
        name="meeting_name"
        label="Meeting"
        value={p.meeting_name}
        disabled={true}
        readonly={true}
      />

      {#if p.meeting_schedule_type !== "ephemeral"}
        <p class="text-muted me-3 mt-3 mb-1">Invite to become</p>
        <Radio
          bind:value={p.invite_to}
          options={INVITE_TYPE_OPTIONS}
          disabled={true}
        />
      {/if}

      <p class="text-muted me-3 mt-3 mb-1">Allow to join as</p>
      <Radio
        bind:value={p.join_as}
        options={AFFILIATION_OPTIONS}
        disabled={true}
      />

      {#if p.invite_to === "member"}
        <p class="text-muted me-3 mt-3 mb-1"></p>
        <Switch
          name="disposable"
          label="Disposable"
          desc="(can only be used once)"
          bind:value={p.disposable}
          disabled={true}
        />
      {/if}

      {#if warning}
        <Warning>The delete request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel bind:disabled on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Delete" bind:disabled />
      </div>
    </form>
  </div>
</section>
