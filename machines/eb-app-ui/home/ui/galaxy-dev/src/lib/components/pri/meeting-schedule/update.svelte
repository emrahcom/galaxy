<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/api";
  import {
    getDuration,
    getEndTime,
    getToday,
    isAllDay,
    isOver,
    toLocaleDate,
    toLocaleTime,
  } from "$lib/common";
  import type { MeetingSchedule } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Checkbox from "$lib/components/common/form-checkbox.svelte";
  import Day from "$lib/components/common/form-date.svelte";
  import Numeric from "$lib/components/common/form-select-number.svelte";
  import Range from "$lib/components/common/form-range.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Switch from "$lib/components/common/form-switch.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Time from "$lib/components/common/form-time.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: MeetingSchedule;

  const timezoneOffset = new Date().getTimezoneOffset();
  const defaultDuration = Number(p.schedule_attr.duration);
  let duration = defaultDuration;
  let date0 = toLocaleDate(p.schedule_attr.started_at);
  let date1 = p.schedule_attr.rep_end_at
    ? toLocaleDate(p.schedule_attr.rep_end_at)
    : date0;
  let time0 = toLocaleTime(p.schedule_attr.started_at);
  let time1 = getEndTime(time0, duration);
  let allDay = isAllDay(p.schedule_attr.started_at, p.schedule_attr.duration);
  let every = Number(p.schedule_attr.rep_every) || 1;
  let times = Number(p.schedule_attr.rep_end_x) || 10;
  let notBefore = getToday();
  if (date0 < notBefore) notBefore = date0;
  let d0 = p.schedule_attr.rep_days
    ? Boolean(Number(p.schedule_attr.rep_days[0]))
    : false;
  let d1 = p.schedule_attr.rep_days
    ? Boolean(Number(p.schedule_attr.rep_days[1]))
    : false;
  let d2 = p.schedule_attr.rep_days
    ? Boolean(Number(p.schedule_attr.rep_days[2]))
    : false;
  let d3 = p.schedule_attr.rep_days
    ? Boolean(Number(p.schedule_attr.rep_days[3]))
    : false;
  let d4 = p.schedule_attr.rep_days
    ? Boolean(Number(p.schedule_attr.rep_days[4]))
    : false;
  let d5 = p.schedule_attr.rep_days
    ? Boolean(Number(p.schedule_attr.rep_days[5]))
    : false;
  let d6 = p.schedule_attr.rep_days
    ? Boolean(Number(p.schedule_attr.rep_days[6]))
    : false;
  let warning = false;
  let disabled = false;

  // ---------------------------------------------------------------------------
  function startTimeUpdated() {
    try {
      time1 = getEndTime(time0, duration);
    } catch {
      //do nothing
    }
  }

  // ---------------------------------------------------------------------------
  function endTimeUpdated() {
    try {
      duration = getDuration(time0, time1);
    } catch {
      //do nothing
    }
  }

  // ---------------------------------------------------------------------------
  function durationUpdated() {
    try {
      const _duration = Math.round(Number(duration));

      if (isNaN(_duration)) {
        throw new Error("no valid duration");
      } else if (_duration === 0) {
        throw new Error("no duration");
      } else if (_duration < 0) {
        throw new Error("negative duration");
      } else if (_duration > 1440) {
        duration = 1440;
      } else {
        duration = _duration;
      }
    } catch {
      duration = defaultDuration;
    }

    try {
      time1 = getEndTime(time0, duration);
    } catch {
      //do nothing
    }
  }

  // ---------------------------------------------------------------------------
  function durationTyped(e: Event) {
    try {
      const target = e.target as HTMLInputElement;
      time1 = getEndTime(time0, Number(target.value));
    } catch {
      //do nothing
    }
  }

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = `/pri/meeting/schedule/${p.meeting_id}`;
  }

  // ---------------------------------------------------------------------------
  function normalizeData() {
    // Get the timezone offset (difference as minutes) of the client side. There
    // is an issue here if the creating and updating timezones are different and
    // selected start time is in different days for these two timezones.
    // Skip it, dont fix.
    p.schedule_attr.timezone_offset = `${timezoneOffset}`;

    // if all day meeting, overwrite the start time and duration
    if (allDay) {
      time0 = "00:00";
      duration = 1440;
    }

    const started_at = new Date(`${date0}T${time0}`);
    const ended_at = new Date(`${date1}T23:59:59`);

    if (p.schedule_attr.type === "o") {
      // if the end time of the only session is over, throw an error
      if (isOver(started_at, duration)) throw new Error("it is already over");
    } else if (p.schedule_attr.type === "d") {
      // If the end time of the last session is over, throw an error.
      // Dont care how many sessions are over if there is still time for the
      // last one. Count the old sessions too.
      if (isOver(started_at, (times - 1) * every * 1440 + duration)) {
        throw new Error("it is already over");
      }

      p.schedule_attr.rep_end_type = "x";
      p.schedule_attr.rep_end_x = String(times);
      p.schedule_attr.rep_every = String(every);
    } else if (p.schedule_attr.type === "w") {
      // If the end date is over, throw an error.
      if (isOver(ended_at, 0)) throw new Error("it is already over");
      // if the last date is earlier than the first date, throw an error.
      if (date1 < date0) throw new Error("invalid period");
      // if no selected day, throw an error.
      if (!(d0 || d1 || d2 || d3 || d4 || d5 || d6)) throw new Error("no day");

      p.schedule_attr.rep_end_type = "at";
      p.schedule_attr.rep_end_at = ended_at.toISOString();
      p.schedule_attr.rep_every = String(every);
      p.schedule_attr.rep_days =
        (d0 ? "1" : "0") +
        (d1 ? "1" : "0") +
        (d2 ? "1" : "0") +
        (d3 ? "1" : "0") +
        (d4 ? "1" : "0") +
        (d5 ? "1" : "0") +
        (d6 ? "1" : "0");
    }

    p.schedule_attr.started_at = started_at.toISOString();
    p.schedule_attr.duration = String(duration);
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      disabled = true;

      normalizeData();
      await action("/api/pri/meeting/schedule/update", p);

      window.location.href = `/pri/meeting/schedule/${p.meeting_id}`;
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="update">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      {#if p.schedule_attr.type === "o"}
        <Day
          name="date0"
          label="Date"
          bind:value={date0}
          min={notBefore}
          required={true}
        />
      {:else if p.schedule_attr.type === "d"}
        <Day
          name="date0"
          label="From"
          bind:value={date0}
          min={notBefore}
          required={true}
        />
        <Numeric
          id="every"
          label="Every"
          bind:value={every}
          unit="day"
          max={30}
        />
        <Numeric
          id="times"
          label="Times"
          bind:value={times}
          unit="time"
          min={2}
          max={99}
        />
      {:else if p.schedule_attr.type === "w"}
        <Day
          name="date0"
          label="From"
          bind:value={date0}
          min={notBefore}
          required={true}
        />
        <Day
          name="date1"
          label="To"
          bind:value={date1}
          min={notBefore}
          required={true}
        />
        <Numeric
          id="every"
          label="Every"
          bind:value={every}
          unit="week"
          max={13}
        />
        <div class="d-flex justify-content-center">
          <Checkbox name="d0" label="Sun" bind:value={d0} />
          <Checkbox name="d1" label="Mon" bind:value={d1} />
          <Checkbox name="d2" label="Tue" bind:value={d2} />
          <Checkbox name="d3" label="Wed" bind:value={d3} />
          <Checkbox name="d4" label="Thu" bind:value={d4} />
          <Checkbox name="d5" label="Fri" bind:value={d5} />
          <Checkbox name="d6" label="Sat" bind:value={d6} />
        </div>
      {/if}

      <div class="mt-4">
        <Switch name="all_day" label="All day meeting" bind:value={allDay} />
      </div>

      {#if !allDay}
        <Time
          name="time0"
          label="Start time"
          bind:value={time0}
          required={true}
          on:change={startTimeUpdated}
        />
        <Time
          name="time1"
          label="End time"
          bind:value={time1}
          required={true}
          on:change={endTimeUpdated}
        />
        <Range
          name="duration"
          label="Duration (minutes)"
          bind:value={duration}
          min={5}
          max={180}
          step={5}
          required={true}
          on:change={durationUpdated}
          on:input={durationTyped}
        />
      {/if}

      <Text
        name="name"
        label="Label (optional)"
        bind:value={p.name}
        required={false}
      />

      {#if warning}
        <Warning>
          The update request is not accepted. Please check your inputs.
        </Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel bind:disabled on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Update" bind:disabled />
      </div>
    </form>
  </div>
</section>
