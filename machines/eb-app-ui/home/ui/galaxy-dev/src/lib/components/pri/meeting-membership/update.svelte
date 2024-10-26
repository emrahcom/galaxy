<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, list } from "$lib/api";
  import type { MeetingMembership, Profile } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Select from "$lib/components/common/form-select.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Textarea from "$lib/components/common/form-textarea.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    p: MeetingMembership;
  }

  let { p }: Props = $props();

  let warning = $state(false);
  let disabled = $state(false);

  const pr = list("/api/pri/profile/list", 100).then((items: Profile[]) => {
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
    globalThis.location.href = `/pri/meeting`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      disabled = true;

      await action("/api/pri/meeting/membership/update", p);
      globalThis.location.href = `/pri/meeting`;
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  {#await pr then profiles}
    <div class="d-flex mt-2 justify-content-center">
      <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
        <Text
          name="meeting_name"
          label="Meeting"
          value={p.meeting_name}
          disabled={true}
          readonly={true}
        />
        <Textarea
          name="meeting_info"
          label="Info"
          value={p.meeting_info}
          disabled={true}
          readonly={true}
        />
        <Select
          id="profile_id"
          label="Profile"
          bind:value={p.profile_id}
          options={profiles}
        />

        {#if warning}
          <Warning>The update request is not accepted.</Warning>
        {/if}

        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Cancel bind:disabled on:click={cancel} />
          <SubmitBlocker />
          <Submit label="Update" bind:disabled />
        </div>
      </form>
    </div>
  {:catch}
    <Warning>Something went wrong</Warning>
  {/await}
</section>
