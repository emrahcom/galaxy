<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/api";
  import {
    INVITE_TYPE_OPTIONS,
    AFFILIATION_OPTIONS,
  } from "$lib/pri/meeting-invite";
  import type { Meeting } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Radio from "$lib/components/common/form-radio.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Switch from "$lib/components/common/form-switch.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let meeting: Meeting;

  const date = new Date();

  let warning = false;
  let p = {
    name: `invite-${date.getTime() % 10000000000}`,
    meeting_id: meeting.id,
    invite_to: "audience",
    join_as: "guest",
    disposable: true,
  };

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = `/pri/meeting/invite/${meeting.id}`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;

      if (meeting.schedule_type === "ephemeral") p.invite_to = "audience";
      if (p.invite_to === "audience") p.disposable = false;

      await action("/api/pri/meeting/invite/add", p);
      window.location.href = `/pri/meeting/invite/${meeting.id}`;
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text name="name" label="Name" bind:value={p.name} required={true} />
      <Text
        name="meeting_name"
        label="Meeting"
        value={meeting.name}
        disabled={true}
        readonly={true}
      />

      {#if meeting.schedule_type !== "ephemeral"}
        <p class="text-muted me-3 mt-3 mb-1">Invite to become</p>
        <Radio bind:value={p.invite_to} options={INVITE_TYPE_OPTIONS} />
      {/if}

      <p class="text-muted me-3 mt-3 mb-1">Allow to join as</p>
      <Radio bind:value={p.join_as} options={AFFILIATION_OPTIONS} />

      {#if p.invite_to === "member"}
        <p class="text-muted me-3 mt-3 mb-1" />
        <Switch
          name="disposable"
          label="Disposable"
          desc="(can only be used once)"
          bind:value={p.disposable}
        />
      {/if}

      {#if warning}
        <Warning>
          The create request is not accepted. Please check your inputs.
        </Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Create" />
      </div>
    </form>
  </div>
</section>
