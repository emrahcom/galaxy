<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/api";
  import { toInputTime } from "$lib/common";
  import type { MeetingSchedule } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Datetime from "$lib/components/common/form-datetime.svelte";
  import Range from "$lib/components/common/form-range.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: MeetingSchedule;

  const min = toInputTime();
  let started_at = toInputTime(p.schedule_attr.started_at);
  let duration = Number(p.schedule_attr.duration);
  let warning = false;

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = `/pri/meeting/schedule/${p.meeting_id}`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;

      const at = new Date(started_at);
      p.schedule_attr.started_at = at.toISOString();
      p.schedule_attr.duration = String(duration);

      await action("/api/pri/meeting/schedule/update", p);
      window.location.href = `/pri/meeting/schedule/${p.meeting_id}`;
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="update">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text
        name="name"
        label="Tag (optional)"
        bind:value={p.name}
        required={false}
      />
      <Datetime
        name="started_at"
        label="Time"
        bind:value={started_at}
        {min}
        required={true}
      />
      <Range
        name="duration"
        label="Duration (minutes)"
        bind:value={duration}
        min={5}
        max={120}
        step={5}
        required={true}
      />

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
</section>
