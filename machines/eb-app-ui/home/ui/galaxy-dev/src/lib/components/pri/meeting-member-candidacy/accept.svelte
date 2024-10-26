<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, get, list } from "$lib/api";
  import type { MeetingMemberCandidacy, Profile } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Select from "$lib/components/common/form-select.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    p: MeetingMemberCandidacy;
  }

  let { p }: Props = $props();

  let warning = $state(false);
  let disabled = $state(false);
  let profileId = $state("");

  const pr1 = get("/api/pri/profile/get/default").then((item: Profile) => {
    if (item) profileId = item.id;
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
    globalThis.location.href = "/pri/meeting";
  }

  // ---------------------------------------------------------------------------
  async function onsubmit() {
    try {
      const data = {
        id: p.id,
        profile_id: profileId,
      };

      warning = false;
      disabled = true;

      await action("/api/pri/meeting/member/candidacy/accept", data);
      globalThis.location.href = "/pri/meeting";
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="accept">
  <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
  {#await Promise.all([pr1, pr2]) then [_p, profiles]}
    <div class="d-flex mt-2 justify-content-center">
      <form {onsubmit} style="width:{FORM_WIDTH};">
        <Text
          name="meeting_name"
          label="Meeting"
          value={p.meeting_name}
          disabled={true}
          readonly={true}
        />
        <Select
          id="profile_id"
          label="Profile"
          bind:value={profileId}
          options={profiles}
        />

        {#if warning}
          <Warning>The accept request is not accepted.</Warning>
        {/if}

        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Cancel {disabled} on:click={cancel} />
          <SubmitBlocker />
          <Submit {disabled} label="Accept" />
        </div>
      </form>
    </div>
  {:catch}
    <Warning>Something went wrong</Warning>
  {/await}
</section>
