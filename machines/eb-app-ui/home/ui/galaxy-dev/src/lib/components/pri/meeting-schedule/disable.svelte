<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { actionById } from "$lib/api";
  import { isAllDay, toLocaleDate, toLocaleInterval } from "$lib/common";
  import type { MeetingSchedule } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Checkbox from "$lib/components/common/form-checkbox.svelte";
  import Day from "$lib/components/common/form-date.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    p: MeetingSchedule;
  }

  const { p }: Props = $props();

  const date0 = $derived(toLocaleDate(p.schedule_attr.started_at));
  const interval = $derived(
    toLocaleInterval(
      p.schedule_attr.started_at,
      Number(p.schedule_attr.duration),
    ),
  );
  let date1 = $state("");
  let every = $state("");
  let times = $state("1 time");
  let d0 = $state(false);
  let d1 = $state(false);
  let d2 = $state(false);
  let d3 = $state(false);
  let d4 = $state(false);
  let d5 = $state(false);
  let d6 = $state(false);
  let warning = $state(false);
  let disabled = $state(false);

  $effect(() => {
    if (p.schedule_attr.type === "d") {
      if (p.schedule_attr.rep_every === "1") {
        every = "1 day";
      } else {
        every = `${p.schedule_attr.rep_every} days`;
      }

      if (p.schedule_attr.rep_end_x !== "1") {
        times = `${p.schedule_attr.rep_end_x} times`;
      }
    } else if (p.schedule_attr.type === "w") {
      date1 = toLocaleDate(p.schedule_attr.rep_end_at);

      if (p.schedule_attr.rep_every === "1") {
        every = "1 week";
      } else {
        every = `${p.schedule_attr.rep_every} weeks`;
      }

      d0 = p.schedule_attr.rep_days[0] === "1";
      d1 = p.schedule_attr.rep_days[1] === "1";
      d2 = p.schedule_attr.rep_days[2] === "1";
      d3 = p.schedule_attr.rep_days[3] === "1";
      d4 = p.schedule_attr.rep_days[4] === "1";
      d5 = p.schedule_attr.rep_days[5] === "1";
      d6 = p.schedule_attr.rep_days[6] === "1";
    }
  });

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = `/pri/meeting/schedule/${p.meeting_id}`;
  }

  // ---------------------------------------------------------------------------
  async function onsubmit() {
    try {
      warning = false;
      disabled = true;

      await actionById("/api/pri/meeting/schedule/disable", p.id);
      globalThis.location.href = `/pri/meeting/schedule/${p.meeting_id}`;
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="disable">
  <div class="d-flex mt-2 justify-content-center">
    <form {onsubmit} style="width:{FORM_WIDTH};">
      {#if p.schedule_attr.type === "o"}
        <Day
          name="date0"
          label="Date"
          value={date0}
          disabled={true}
          readonly={true}
        />
      {:else if p.schedule_attr.type === "d"}
        <Day
          name="date0"
          label="From"
          value={date0}
          disabled={true}
          readonly={true}
        />
        <Text
          name="every"
          label="Every"
          value={every}
          disabled={true}
          readonly={true}
        />
        <Text
          name="times"
          label="Times"
          value={times}
          disabled={true}
          readonly={true}
        />
      {:else if p.schedule_attr.type === "w"}
        <Day
          name="date0"
          label="From"
          value={date0}
          disabled={true}
          readonly={true}
        />
        <Day
          name="date1"
          label="To"
          value={date1}
          disabled={true}
          readonly={true}
        />
        <Text
          name="every"
          label="Every"
          value={every}
          disabled={true}
          readonly={true}
        />
        <div class="d-flex justify-content-center">
          <Checkbox name="d0" label="Sun" value={d0} disabled={true} />
          <Checkbox name="d1" label="Mon" value={d1} disabled={true} />
          <Checkbox name="d2" label="Tue" value={d2} disabled={true} />
          <Checkbox name="d3" label="Wed" value={d3} disabled={true} />
          <Checkbox name="d4" label="Thu" value={d4} disabled={true} />
          <Checkbox name="d5" label="Fri" value={d5} disabled={true} />
          <Checkbox name="d6" label="Sat" value={d6} disabled={true} />
        </div>
      {/if}

      {#if isAllDay(p.schedule_attr.started_at, p.schedule_attr.duration)}
        <Text
          name="duration"
          label="Duration"
          value="All day"
          disabled={true}
          readonly={true}
        />
      {:else}
        <Text
          name="interval"
          label="Time"
          value={interval}
          disabled={true}
          readonly={true}
        />
        <Text
          name="duration"
          label="Duration (minutes)"
          value={`${p.schedule_attr.duration}`}
          disabled={true}
          readonly={true}
        />
      {/if}

      {#if p.name}
        <Text
          name="name"
          label="Label"
          value={p.name}
          disabled={true}
          readonly={true}
        />
      {/if}

      {#if warning}
        <Warning>The disable request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel {disabled} onclick={cancel} />
        <SubmitBlocker />
        <Submit {disabled} label="Disable" />
      </div>
    </form>
  </div>
</section>
