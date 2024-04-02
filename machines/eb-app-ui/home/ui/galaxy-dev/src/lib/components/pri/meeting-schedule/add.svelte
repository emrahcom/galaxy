<script lang="ts">
  import { page } from "$app/stores";
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/api";
  import { today } from "$lib/common";
  import type { Meeting } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Day from "$lib/components/common/form-date.svelte";
  import Range from "$lib/components/common/form-range.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Time from "$lib/components/common/form-time.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let meeting: Meeting;
  const hash = $page.url.hash;

  const min = today();
  let date0 = today();
  let time0 = "08:30";

  let warning = false;
  let p = {
    name: "",
    meeting_id: meeting.id,
    schedule_attr: {
      type: "o",
      started_at: "",
      duration: 30,
    },
  };

  // ---------------------------------------------------------------------------
  function cancel() {
    if (hash === "#0") {
      window.location.href = `/pri/meeting`;
    } else {
      window.location.href = `/pri/meeting/schedule/${meeting.id}`;
    }
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;

      const at = new Date(`${date0}T${time0}`);
      p.schedule_attr.started_at = at.toISOString();

      await action("/api/pri/meeting/schedule/add", p);

      if (hash === "#0") {
        window.location.href = `/pri/meeting/invite/${meeting.id}`;
      } else {
        window.location.href = `/pri/meeting/schedule/${meeting.id}`;
      }
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text
        name="name"
        label="Tag (optional)"
        bind:value={p.name}
        required={false}
      />
      <Day name="date0" label="Date" bind:value={date0} {min} required={true} />
      <Time name="time0" label="Time" bind:value={time0} required={true} />
      <Range
        name="duration"
        label="Duration (minutes)"
        bind:value={p.schedule_attr.duration}
        min={5}
        max={120}
        step={5}
        required={true}
      />

      {#if warning}
        <Warning>
          The create request is not accepted. Please check your inputs.
        </Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel
          label={hash === "#0" ? "Not Now" : "Cancel"}
          on:click={cancel}
        />
        <SubmitBlocker />
        <Submit label="Create" />
      </div>
    </form>
  </div>
</section>
