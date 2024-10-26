<script lang="ts">
  import { page } from "$app/stores";
  import { FORM_WIDTH } from "$lib/config";
  import { SCHEDULE_ATTR_TYPE_OPTIONS } from "$lib/pri/meeting-schedule";
  import { action } from "$lib/api";
  import {
    dateAfterXDays,
    getDuration,
    getEndTime,
    getLastDayOfWeek,
    getToday,
    isOver,
  } from "$lib/common";
  import type { Meeting } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Checkbox from "$lib/components/common/form-checkbox.svelte";
  import Day from "$lib/components/common/form-date.svelte";
  import Numeric from "$lib/components/common/form-select-number.svelte";
  import RadioInline from "$lib/components/common/form-radio-inline.svelte";
  import Range from "$lib/components/common/form-range.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Switch from "$lib/components/common/form-switch.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Time from "$lib/components/common/form-time.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    meeting: Meeting;
  }

  let { meeting }: Props = $props();

  const hash = $page.url.hash;

  const timezoneOffset = new Date().getTimezoneOffset();
  const notBefore = getToday();
  const defaultDuration = 30;
  let duration = $state(defaultDuration);
  let date0 = $state(getToday());
  const dateAfter90Days = dateAfterXDays(90);
  let date1 = $state(getLastDayOfWeek(`${dateAfter90Days}T00:00:00`));
  let time0 = $state("08:30");
  let time1 = $state(getEndTime("08:30", defaultDuration));
  let allDay = $state(false);
  let everyDay = $state(1);
  let everyWeek = $state(1);
  let times = $state(10);
  let d0 = $state(false);
  let d1 = $state(true);
  let d2 = $state(true);
  let d3 = $state(true);
  let d4 = $state(true);
  let d5 = $state(true);
  let d6 = $state(false);

  let warning = $state(false);
  let disabled = $state(false);
  let p = $state({
    name: "",
    meeting_id: meeting.id,
    schedule_attr: {
      type: "o",
      started_at: "",
      duration: "",
      rep_end_type: "",
      rep_end_at: "",
      rep_end_x: "",
      rep_every: "",
      rep_days: "",
      timezone_offset: `${timezoneOffset}`,
    },
  });

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
        throw "no valid duration";
      } else if (_duration === 0) {
        throw "no duration";
      } else if (_duration < 0) {
        throw "negative duration";
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
    if (hash === "#0") {
      globalThis.location.href = `/pri/meeting`;
    } else {
      globalThis.location.href = `/pri/meeting/schedule/${meeting.id}`;
    }
  }

  // ---------------------------------------------------------------------------
  function normalizeData() {
    // if all day meeting, overwrite the start time and duration
    if (allDay) {
      time0 = "00:00";
      duration = 1440;
    }

    const started_at = new Date(`${date0}T${time0}`);
    const ended_at = new Date(`${date1}T23:59:59`);

    if (p.schedule_attr.type === "o") {
      // if the end time of the only session is over, throw an error
      if (isOver(started_at, duration)) throw "it is already over";
    } else if (p.schedule_attr.type === "d") {
      // If the end time of the last session is over, throw an error.
      // Dont care how many sessions are over if there is still time for the
      // last one. Count the old sessions too.
      if (isOver(started_at, (times - 1) * everyDay * 1440 + duration)) {
        throw "it is already over";
      }

      p.schedule_attr.rep_end_type = "x";
      p.schedule_attr.rep_end_x = String(times);
      p.schedule_attr.rep_every = String(everyDay);
    } else if (p.schedule_attr.type === "w") {
      // If the end date is over, throw an error.
      if (isOver(ended_at)) throw "it is already over";
      // if the last date is earlier than the first date, throw an error.
      if (date1 < date0) throw "invalid period";
      // if no selected day, throw an error.
      if (!(d0 || d1 || d2 || d3 || d4 || d5 || d6)) throw "no day";

      p.schedule_attr.rep_end_type = "at";
      p.schedule_attr.rep_end_at = ended_at.toISOString();
      p.schedule_attr.rep_every = String(everyWeek);
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
  async function onsubmit() {
    try {
      warning = false;
      disabled = true;

      normalizeData();
      await action("/api/pri/meeting/schedule/add", p);

      if (hash === "#0") {
        globalThis.location.href = `/pri/meeting/invite/${meeting.id}`;
      } else {
        globalThis.location.href = `/pri/meeting/schedule/${meeting.id}`;
      }
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  <div class="d-flex mt-2 justify-content-center">
    <form {onsubmit} style="width:{FORM_WIDTH};">
      <div class="d-flex gap-3 my-5 justify-content-center">
        <RadioInline
          bind:value={p.schedule_attr.type}
          options={SCHEDULE_ATTR_TYPE_OPTIONS}
        />
      </div>

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
          id="everyDay"
          label="Every"
          bind:value={everyDay}
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
          id="everyWeek"
          label="Every"
          bind:value={everyWeek}
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
          onchange={startTimeUpdated}
        />
        <Time
          name="time1"
          label="End time"
          bind:value={time1}
          required={true}
          onchange={endTimeUpdated}
        />
        <Range
          name="duration"
          label="Duration (minutes)"
          bind:value={duration}
          min={5}
          max={180}
          step={5}
          required={true}
          onchange={durationUpdated}
          oninput={durationTyped}
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
          The create request is not accepted. Please check your inputs.
        </Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel
          {disabled}
          label={hash === "#0" ? "Not Now" : "Cancel"}
          onclick={cancel}
        />
        <SubmitBlocker />
        <Submit {disabled} label="Create" />
      </div>
    </form>
  </div>
</section>
