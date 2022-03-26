<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, get, list } from "$lib/api";
  import type { MeetingInviteReduced, Profile } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Select from "$lib/components/common/form-select.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let invite: MeetingInviteReduced;

  let warning = false;
  let p = {
    code: invite.code,
    profile_id: "",
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

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = `/pri/meeting`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      await action("/api/pri/meeting/membership/add/bycode", p);
      window.location.href = `/pri/meeting`;
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  {#await Promise.all([pr1, pr2]) then [_p, profiles]}
    <div class="d-flex mt-2 justify-content-center">
      <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
        <Text
          name="meeting_name"
          label="Meeting"
          value={invite.meeting_name}
          readonly={true}
        />
        <Text
          name="meeting_info"
          label="Info"
          value={invite.meeting_info}
          readonly={true}
        />
        <Select
          id="profile_id"
          label="Profile"
          bind:value={p.profile_id}
          options={profiles}
        />

        {#if warning}
          <Warning>The add request is not accepted.</Warning>
        {/if}

        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Cancel on:click={cancel} />
          <SubmitBlocker />
          <Submit label="Add" />
        </div>
      </form>
    </div>
  {:catch}
    <Warning>Something went wrong</Warning>
  {/await}
</section>
