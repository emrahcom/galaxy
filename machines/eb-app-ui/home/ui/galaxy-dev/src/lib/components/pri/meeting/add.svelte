<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, get, list } from "$lib/api";
  import { SCHEDULE_TYPE_OPTIONS } from "$lib/pri/meeting";
  import type { Domain333, Profile, Room333 } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Radio from "$lib/components/common/form-radio.svelte";
  import Select from "$lib/components/common/form-select.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Switch from "$lib/components/common/form-switch.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Textarea from "$lib/components/common/form-textarea.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  let warning = false;
  let disabled = false;
  let domainId = "";
  let p = {
    profile_id: "",
    room_id: "",
    room_static: false,
    name: "",
    info: "",
    schedule_type: SCHEDULE_TYPE_OPTIONS[0][0],
    hidden: true,
    restricted: false,
    subscribable: true,
  };

  const pr1 = get("/api/pri/profile/get/default").then((item: Profile) => {
    if (item) p.profile_id = item.id;
    return item;
  });

  const pr2 = list("/api/pri/profile/list", 100).then((items: Profile[]) => {
    return items.map((i) => {
      let desc: string;

      if (i.email) {
        desc = `${i.name} (${i.email})`;
      } else {
        desc = i.name;
      }

      return [i.id, desc];
    });
  });

  const pr3 = list("/api/pri/domain/list", 100).then((items: Domain333[]) => {
    const enableds = items
      .filter((i) => i.enabled)
      .sort((i, j) => (i.updated_at > j.updated_at ? -1 : 1));
    if (enableds[0]) domainId = enableds[0].id;

    return items.map((i) => [
      i.id,
      `${i.name}${i.enabled ? "" : " - DISABLED"}`,
    ]);
  });

  const pr4 = list("/api/pri/room/list", 100).then((items: Room333[]) => {
    const enableds = items
      .filter((i) => i.enabled && i.chain_enabled)
      .sort((i, j) => (i.updated_at > j.updated_at ? -1 : 1));
    if (enableds[0]) p.room_id = enableds[0].id;

    return items.map((i) => [
      i.id,
      `${i.name} on ${i.domain_name}${
        i.enabled && i.chain_enabled ? "" : " - DISABLED"
      }`,
    ]);
  });

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = "/pri/meeting";
  }

  // ---------------------------------------------------------------------------
  function normalizeData() {
    // mandatory features for the ephemeral meeting
    if (p.schedule_type === "ephemeral") {
      p.hidden = true;
      p.restricted = false;
      p.subscribable = false;
    }
  }

  // ---------------------------------------------------------------------------
  async function addMeetingInvite(meetingId: string) {
    const date = new Date();
    const i = {
      name: `invite-${date.getTime() % 10000000000}`,
      meeting_id: meetingId,
      invite_to: "audience",
      join_as: "guest",
      disposable: false,
    };

    await action("/api/pri/meeting/invite/add", i);
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      disabled = true;

      normalizeData();

      // add an ephemeral room if needed
      if (p.schedule_type === "ephemeral" || !p.room_static) {
        const r = {
          domain_id: domainId,
        };

        const room = await action("/api/pri/room/add-ephemeral", r);
        p.room_id = room.id;
      }

      const meeting = await action("/api/pri/meeting/add", p);
      await addMeetingInvite(meeting.id);

      // redirect to the next page depending on the schedule type
      if (p.schedule_type === "scheduled") {
        window.location.href = `/pri/meeting/schedule/add/${meeting.id}#0`;
      } else {
        window.location.href = `/pri/meeting/invite/${meeting.id}`;
      }
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
  {#await Promise.all([pr1, pr2, pr3, pr4]) then [_p, profiles, domains, rooms]}
    <div class="d-flex mt-2 justify-content-center">
      <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
        <Text name="name" label="Name" bind:value={p.name} required={true} />
        <Textarea
          name="info"
          label="Info (optional)"
          bind:value={p.info}
          required={false}
        />

        <p class="text-muted me-3 mb-1">Meeting type</p>
        <Radio bind:value={p.schedule_type} options={SCHEDULE_TYPE_OPTIONS} />

        <Select
          id="profile_id"
          label="Profile"
          bind:value={p.profile_id}
          options={profiles}
        />

        {#if p.schedule_type === "ephemeral" || !p.room_static}
          <Select
            id="domain_id"
            label="Jitsi Domain"
            bind:value={domainId}
            options={domains}
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
            name="room_static"
            label="Static room"
            desc="(I want to select a specific room)"
            bind:value={p.room_static}
          />
        {/if}

        <!-- these are temporary disabled on UI, not ready... -->
        <!-- {#if p.schedule_type !== "ephemeral"} -->
        {#if p.schedule_type === "DONT MATCH"}
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
            The add request is not accepted. Please check your inputs.
          </Warning>
        {/if}

        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Cancel bind:disabled on:click={cancel} />
          <SubmitBlocker />
          <Submit label="Add" bind:disabled />
        </div>
      </form>
    </div>
  {:catch}
    <Warning>Something went wrong</Warning>
  {/await}
</section>
