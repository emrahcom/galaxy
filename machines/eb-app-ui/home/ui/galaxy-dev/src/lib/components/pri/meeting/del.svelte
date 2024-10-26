<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { actionById } from "$lib/api";
  import { SCHEDULE_TYPE_OPTIONS } from "$lib/pri/meeting";
  import type { Meeting } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Radio from "$lib/components/common/form-radio.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Switch from "$lib/components/common/form-switch.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Textarea from "$lib/components/common/form-textarea.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    p: Meeting;
  }

  let { p }: Props = $props();

  let warning = $state(false);
  let disabled = $state(false);
  let domainName = $state(p.domain_name);
  let roomName = $state(`${p.room_name} on ${p.domain_name}`);
  let profile = $state("");

  if (p.profile_email) {
    profile = `${p.profile_name || ""} (${p.profile_email})`;
  } else {
    profile = p.profile_name || "";
  }

  if (!p.domain_enabled) {
    domainName = `${p.domain_name} - DISABLED`;
  }
  if (!p.domain_enabled || !p.room_enabled) {
    roomName = `${p.room_name} on ${p.domain_name} - DISABLED`;
  }

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = "/pri/meeting";
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      disabled = true;

      await actionById("/api/pri/meeting/del", p.id);
      globalThis.location.replace("/pri/meeting");
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
      <Textarea
        name="info"
        label="Info"
        value={p.info}
        disabled={true}
        readonly={true}
      />

      <p class="text-muted me-3 mb-1">Meeting type</p>
      <Radio
        value={p.schedule_type}
        options={SCHEDULE_TYPE_OPTIONS}
        disabled={true}
      />

      <Text
        name="profile"
        label="Profile"
        value={profile}
        disabled={true}
        readonly={true}
      />

      {#if p.schedule_type === "ephemeral" || p.room_ephemeral}
        <Text
          name="domain"
          label="Jitsi Domain"
          value={domainName}
          disabled={true}
          readonly={true}
        />
      {:else}
        <Text
          name="room"
          label="Room"
          value={roomName}
          disabled={true}
          readonly={true}
        />
      {/if}

      <!-- these are temporary disabled on UI, not ready... -->
      <!-- {#if p.schedule_type !== "ephemeral"} -->
      {#if false}
        <Switch
          name="hidden"
          label="Hidden"
          desc="(don't show on public pages)"
          value={p.hidden}
          disabled={true}
        />
        <Switch
          name="restricted"
          label="Restricted"
          desc="(only for allowed members)"
          value={p.restricted}
          disabled={true}
        />
        <Switch
          name="subscribable"
          label="Subscribable"
          desc="(allow membership request)"
          value={p.subscribable}
          disabled={true}
        />
      {/if}

      {#if warning}
        <Warning>
          The delete request is not accepted. Please check your inputs.
        </Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel {disabled} on:click={cancel} />
        <SubmitBlocker />
        <Submit {disabled} label="Delete" />
      </div>
    </form>
  </div>
</section>
