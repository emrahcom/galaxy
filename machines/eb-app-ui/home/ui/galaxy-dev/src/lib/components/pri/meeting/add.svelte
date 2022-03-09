<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, get, list } from "$lib/api";
  import { SCHEDULE_TYPE_OPTIONS } from "$lib/pri/meeting";
  import type { Profile, Room } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Radio from "$lib/components/common/form-radio.svelte";
  import Select from "$lib/components/common/form-select.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import Switch from "$lib/components/common/form-switch.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Textarea from "$lib/components/common/form-textarea.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  let warning = false;
  let p = {
    profile_id: "",
    room_id: "",
    name: "",
    info: "",
    schedule_type: SCHEDULE_TYPE_OPTIONS[0][0],
    schedule_attr: {
      duration: 60,
    },
    hidden: true,
    restricted: false,
    subscribable: true,
  };

  let pr1 = get("/api/pri/profile/get/default").then((item: Profile) => {
    p.profile_id = item.id;
    return item;
  });

  let pr2 = list("/api/pri/profile/list", 100).then((items: Room[]) => {
    return items.map((i) => [i.id, i.name]);
  });

  let pr3 = list("/api/pri/room/list", 100).then((items: Room[]) => {
    return items.map((i) => [i.id, `${i.name} on ${i.domain_name}`]);
  });

  function cancel() {
    window.location.href = "/pri/meeting";
  }

  async function onSubmit() {
    try {
      warning = false;
      await action("/api/pri/meeting/add", p);
      window.location.href = "/pri/meeting";
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  {#await Promise.all([pr1, pr2, pr3]) then [_defaultProfile, profiles, rooms]}
    <div class="d-flex mt-2 justify-content-center">
      <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
        <Text name="name" label="Name" bind:value={p.name} required={true} />
        <Textarea
          name="info"
          label="Info"
          bind:value={p.info}
          required={false}
        />

        <p class="text-muted me-3 mb-1">Meeting Type</p>
        <Radio bind:value={p.schedule_type} options={SCHEDULE_TYPE_OPTIONS} />

        <Select
          id="profile_id"
          label="Profile"
          bind:value={p.profile_id}
          options={profiles}
        />

        {#if p.schedule_type === "ephemeral"}
          <Select
            id="room_id"
            label="Room"
            bind:value={p.room_id}
            options={rooms}
          />
        {/if}

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

        {#if warning}
          <Warning>
            The add request is not accepted. Please check your inputs.
          </Warning>
        {/if}

        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Cancel on:click={cancel} />
          <Submit label="Add" />
        </div>
      </form>
    </div>
  {:catch}
    <Warning>Something went wrong</Warning>
  {/await}
</section>
