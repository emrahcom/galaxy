<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, listById } from "$lib/api";
  import { AFFILIATION_OPTIONS } from "$lib/pri/meeting-invite";
  import type { Contact, Meeting } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Radio from "$lib/components/common/form-radio.svelte";
  import Select from "$lib/components/common/form-select.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    meeting: Meeting;
  }

  let { meeting }: Props = $props();

  const pr = listById("/api/pri/contact/list/bymeeting", meeting.id, 1000).then(
    (items: Contact[]) => {
      return items.map((i) => [
        i.id,
        `${i.name}${i.profile_email ? ` (${i.profile_email})` : ""}`,
      ]);
    },
  );

  let warning = $state(false);
  let disabled = $state(false);
  let p = $state({
    contact_id: "",
    meeting_id: meeting.id,
    join_as: "guest",
  });

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = `/pri/meeting/member/${meeting.id}`;
  }

  // ---------------------------------------------------------------------------
  async function onsubmit() {
    try {
      warning = false;
      disabled = true;

      await action("/api/pri/meeting/member/candidate/add", p);
      globalThis.location.href = `/pri/meeting/member/${meeting.id}`;
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  {#await pr then contacts}
    <div class="d-flex mt-2 justify-content-center">
      <form {onsubmit} style="width:{FORM_WIDTH};">
        <Select
          id="contact_id"
          label="Contact"
          bind:value={p.contact_id}
          options={contacts}
        />
        <Text
          name="meeting_name"
          label="Meeting"
          value={meeting.name}
          disabled={true}
          readonly={true}
        />
        <p class="text-muted me-3 mt-3 mb-1">Allow to join as</p>
        <Radio bind:value={p.join_as} options={AFFILIATION_OPTIONS} />

        {#if warning}
          <Warning>
            The invite request is not accepted. Please check your inputs.
          </Warning>
        {/if}

        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Cancel {disabled} onclick={cancel} />
          <SubmitBlocker />
          <Submit {disabled} label="Invite" />
        </div>
      </form>
    </div>
  {:catch}
    <Warning>Something went wrong</Warning>
  {/await}
</section>
