<script lang="ts">
  import { page } from "$app/stores";
  import { FORM_WIDTH } from "$lib/config";
  import { SCHEDULE_ATTR_TYPE_OPTIONS } from "$lib/pri/meeting-schedule";
  import { action } from "$lib/api";
  import { getDuration, getEndTime, isEnded, today } from "$lib/common";
  import type { Meeting } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
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

  export let meeting: Meeting;
  const hash = $page.url.hash;

  const notBefore = today();
  const defaultDuration = 30;
  let duration = defaultDuration;
  let date0 = today();
  let time0 = "08:30";
  let time1 = getEndTime(time0, defaultDuration);
  let allDay = false;
  let every = 1;
  let times = 10;

  let warning = false;
  let p = {
    name: "",
    meeting_id: meeting.id,
    schedule_attr: {
      type: "o",
      started_at: "",
      duration: "",
    },
  };

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

      // if all day meeting, overwrite the start time and duration
      if (allDay) {
        time0 = "00:00";
        duration = 1440;
      }

      const at = new Date(`${date0}T${time0}`);
      if (isEnded(at, duration)) throw new Error("it is already over");

      p.schedule_attr.started_at = at.toISOString();
      p.schedule_attr.duration = String(duration);

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
          max={100}
        />
      {/if}

      <Switch name="all_day" label="All day meeting" bind:value={allDay} />
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
        label="Tag (optional)"
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
          label={hash === "#0" ? "Not Now" : "Cancel"}
          on:click={cancel}
        />
        <SubmitBlocker />
        <Submit label="Create" />
      </div>
    </form>
  </div>
</section>
