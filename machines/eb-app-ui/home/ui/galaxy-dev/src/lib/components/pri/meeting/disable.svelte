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

  export let p: Meeting;

  let warning = false;
  let domainName = p.domain_name;
  let roomName = `${p.room_name} on ${p.domain_name}`;
  let profile: string;

  if (p.profile_email) {
    profile = `${p.profile_name} (${p.profile_email})`;
  } else {
    profile = p.profile_name;
  }

  if (!p.domain_enabled) {
    domainName = `${p.domain_name} - DISABLED`;
  }
  if (!p.domain_enabled || !p.room_enabled) {
    roomName = `${p.room_name} on ${p.domain_name} - DISABLED`;
  }

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = "/pri/meeting";
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      await actionById("/api/pri/meeting/disable", p.id);
      window.location.href = "/pri/meeting";
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="disable">
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

      <p class="text-muted me-3 mb-1">Meeting Type</p>
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

      {#if p.schedule_type === "ephemeral"}
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

      {#if p.schedule_type !== "ephemeral"}
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
          The disable request is not accepted. Please check your inputs.
        </Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Disable" />
      </div>
    </form>
  </div>
</section>
