<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, list } from "$lib/api";
  import {
    SCHEDULE_TYPE_OPTIONS,
    SCHEDULE_TYPE_OPTIONS_2,
  } from "$lib/pri/meeting";
  import type { Domain333, Meeting, Profile, Room333 } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Radio from "$lib/components/common/form-radio.svelte";
  import Select from "$lib/components/common/form-select.svelte";
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
  let domainId = $state(p.domain_id);
  let roomId = $state(p.room_id);
  let roomStatic = $state(!p.room_ephemeral);

  const pr1 = list("/api/pri/profile/list", 100).then((items: Profile[]) => {
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

  const pr2 = list("/api/pri/domain/list", 100).then((items: Domain333[]) => {
    return items.map((i) => [
      i.id,
      `${i.name}${i.enabled ? "" : " - DISABLED"}`,
    ]);
  });

  const pr3 = list("/api/pri/room/list", 100).then((items: Room333[]) => {
    return items.map((i) => [
      i.id,
      `${i.name} on ${i.domain_name}${
        i.enabled && i.chain_enabled ? "" : " - DISABLED"
      }`,
    ]);
  });

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = "/pri/meeting";
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      disabled = true;

      // if ephemeral, just update and go
      if (p.schedule_type === "ephemeral") {
        await action("/api/pri/meeting/update", p);
        globalThis.location.href = "/pri/meeting";
        return;
      }

      // check if there is an update in static room usage
      const initialRoomStatic = !p.room_ephemeral;
      if (initialRoomStatic) {
        if (roomStatic) {
          // still a static room, use the selected one
          p.room_id = roomId;
        } else {
          // no more a static room, add an ephemeral room and use it
          const r = {
            domain_id: domainId,
          };

          const room = await action("/api/pri/room/add-ephemeral", r);
          p.room_id = room.id;
        }
      } else {
        if (roomStatic) {
          // switched to a static room, use the selected room
          p.room_id = roomId;
        } else {
          if (domainId !== p.domain_id) {
            // still an ephemeral room on a different domain
            // add a new ephemeral room on the selected domain and use it
            const r = {
              domain_id: domainId,
            };

            const room = await action("/api/pri/room/add-ephemeral", r);
            p.room_id = room.id;
          } else {
            // still an ephemeral room on the same domain, use the old one
            // so, no need to update the dataset for room_id
          }
        }
      }

      await action("/api/pri/meeting/update", p);
      globalThis.location.href = "/pri/meeting";
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="update">
  <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
  {#await Promise.all([pr1, pr2, pr3]) then [profiles, domains, rooms]}
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
            disabled={true}
            readonly={true}
          />
        {:else if !roomStatic}
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
            bind:value={roomId}
            options={rooms}
          />
        {/if}

        {#if p.schedule_type !== "ephemeral"}
          <Switch
            name="room_static"
            label="Static room"
            desc="(I want to select a specific room)"
            bind:value={roomStatic}
          />
        {/if}

        <!-- these are temporary disabled on UI, not ready... -->
        <!-- {#if p.schedule_type !== "ephemeral"} -->
        {#if false}
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
          <Cancel {disabled} on:click={cancel} />
          <SubmitBlocker />
          <Submit {disabled} label="Update" />
        </div>
      </form>
    </div>
  {:catch}
    <Warning>Something went wrong</Warning>
  {/await}
</section>
