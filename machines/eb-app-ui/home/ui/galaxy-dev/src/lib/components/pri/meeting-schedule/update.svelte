<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/api";
  import {
    today,
    toLocaleDate,
    toLocaleEndTime,
    toLocaleTime,
  } from "$lib/common";
  import type { MeetingSchedule } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Day from "$lib/components/common/form-date.svelte";
  import Range from "$lib/components/common/form-range.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Time from "$lib/components/common/form-time.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: MeetingSchedule;

  const min = today();
  let date0 = toLocaleDate(p.schedule_attr.started_at);
  let time0 = toLocaleTime(p.schedule_attr.started_at);
  let duration = Number(p.schedule_attr.duration);
  let time1 = toLocaleEndTime(date0, time0, duration);
  let warning = false;

  // ---------------------------------------------------------------------------
  function startTimeChanged() {
    try {
      time1 = toLocaleEndTime(date0, time0, duration);
    } catch {
      //do nothing
    }
  }

  // ---------------------------------------------------------------------------
  function endTimeChanged(e: Event) {
    try {
      const target = e.target as HTMLInputElement;
      console.error(target.value);
    } catch {
      //do nothing
    }
  }

  // ---------------------------------------------------------------------------
  function durationUpdated(e: Event) {
    try {
      const target = e.target as HTMLInputElement;
      console.error(target.value);
    } catch {
      //do nothing
    }
  }

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = `/pri/meeting/schedule/${p.meeting_id}`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;

      const at = new Date(`${date0}T${time0}`);
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
      <Day name="date0" label="Date" bind:value={date0} {min} required={true} />
      <Time
        name="time0"
        label="Start time"
        bind:value={time0}
        required={true}
        on:input={startTimeChanged}
      />
      <Time
        name="time1"
        label="End time"
        bind:value={time1}
        required={true}
        on:input={endTimeChanged}
      />
      <Range
        name="duration"
        label="Duration (minutes)"
        bind:value={duration}
        min={5}
        max={180}
        step={5}
        required={true}
        on:input={durationUpdated}
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
