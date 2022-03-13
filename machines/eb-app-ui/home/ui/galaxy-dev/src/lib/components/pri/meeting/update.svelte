<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, getById, list } from "$lib/api";
  import {
    SCHEDULE_TYPE_OPTIONS,
    SCHEDULE_TYPE_OPTIONS_2,
  } from "$lib/pri/meeting";
  import type { Domain, Meeting, Profile, Room } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Radio from "$lib/components/common/form-radio.svelte";
  import Select from "$lib/components/common/form-select.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Switch from "$lib/components/common/form-switch.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Textarea from "$lib/components/common/form-textarea.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: Meeting;

  let warning = false;

  const pr1 = list("/api/pri/profile/list", 100).then((items: Profile[]) => {
    return items.map((i) => [i.id, i.name]);
  });

  const pr2 = list("/api/pri/room/list", 100).then((items: Room[]) => {
    return items.map((i) => [
      i.id,
      `${i.name} on ${i.domain_name}${i.chain_enabled ? "" : " - DISABLED"}`,
    ]);
  });

  const pr3 = getById("/api/pri/domain/get", p.domain_id).then(
    (item: Domain) => {
      if (!item.enabled) p.domain_name = `${p.domain_name} - DISABLED`;
    },
  );

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = "/pri/meeting";
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      await action("/api/pri/meeting/update", p);
      window.location.href = "/pri/meeting";
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="update">
  {#await Promise.all([pr1, pr2, pr3]) then [profiles, rooms, _domain]}
    <div class="d-flex mt-2 justify-content-center">
      <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
        <Text name="name" label="Name" bind:value={p.name} required={true} />
        <Textarea
          name="info"
          label="Info (optional)"
          bind:value={p.info}
          required={false}
        />

        <p class="text-muted me-3 mb-1">Meeting Type</p>
        {#if p.schedule_type === "ephemeral"}
          <Radio
            value={p.schedule_type}
            options={SCHEDULE_TYPE_OPTIONS}
            disabled={true}
          />
        {:else}
          <Radio
            bind:value={p.schedule_type}
            options={SCHEDULE_TYPE_OPTIONS_2}
          />
        {/if}

        <Select
          id="profile_id"
          label="Profile"
          bind:value={p.profile_id}
          options={profiles}
        />

        {#if p.schedule_type === "ephemeral"}
          <Text
            name="domain_name"
            label="Jitsi Domain"
            value={p.domain_name}
            readonly={true}
          />
        {:else}
          <Select
            id="room_id"
            label="Room"
            bind:value={p.room_id}
            options={rooms}
          />
        {/if}

        {#if p.schedule_type !== "ephemeral"}
          <Switch
            name="hidden"
            label="Hidden"
            desc="(don't show on public pages)"
            bind:value={p.hidden}
          />
          <Switch
            name="restricted"
            label="Restricted"
            desc="(only for allowed members)"
            bind:value={p.restricted}
          />
          <Switch
            name="subscribable"
            label="Subscribable"
            desc="(allow membership request)"
            bind:value={p.subscribable}
          />
        {/if}

        {#if warning}
          <Warning>
            The update request is not accepted. Please check your inputs.
          </Warning>
        {/if}

        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Cancel on:click={cancel} />
          <SubmitBlocker />
          <Submit label="Update" />
        </div>
      </form>
    </div>
  {:catch}
    <Warning>Something went wrong</Warning>
  {/await}
</section>
