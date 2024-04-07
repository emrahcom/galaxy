<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { actionById } from "$lib/api";
  import { isAllDay, toLocaleDate, toLocaleInterval } from "$lib/common";
  import type { MeetingSchedule } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Day from "$lib/components/common/form-date.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: MeetingSchedule;

  let date0 = toLocaleDate(p.schedule_attr.started_at);
  let interval = toLocaleInterval(
    p.schedule_attr.started_at,
    Number(p.schedule_attr.duration),
  );
  let warning = false;

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = `/pri/meeting/schedule/${p.meeting_id}`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      await actionById("/api/pri/meeting/schedule/del", p.id);
      window.location.href = `/pri/meeting/schedule/${p.meeting_id}`;
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="del">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      {#if p.name}
        <Text
          name="name"
          label="Tag"
          value={p.name}
          disabled={true}
          readonly={true}
        />
      {/if}

      <Day
        name="date0"
        label="Date"
        value={date0}
        disabled={true}
        readonly={true}
      />

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

      {#if warning}
        <Warning>The delete request is not accepted.</Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Delete" />
      </div>
    </form>
  </div>
</section>
