<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/api";
  import type { Meeting } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Datetime from "$lib/components/common/form-datetime.svelte";
  import Range from "$lib/components/common/form-range.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let meeting: Meeting;

  const _time1 = new Date();
  const _time2 = new Date(
    _time1.getTime() - 60 * 1000 * _time1.getTimezoneOffset(),
  );
  let time = _time2.toISOString().slice(0, 16);
  const min = time;

  let warning = false;
  let p = {
    name: "",
    meeting_id: meeting.id,
    started_at: "",
    duration: 30,
  };

  // ---------------------------------------------------------------------------
  function cancel() {
    window.location.href = `/pri/meeting/schedule/${meeting.id}`;
  }

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;

      const started_at = new Date(time);
      p.started_at = started_at.toISOString();

      await action("/api/pri/meeting/schedule/add", p);
      window.location.href = `/pri/meeting/schedule/${meeting.id}`;
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
      <Datetime
        name="time"
        label="Time"
        bind:value={time}
        {min}
        required={true}
      />
      <Range
        name="duration"
        label="Duration (minutes)"
        bind:value={p.duration}
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
        <Cancel on:click={cancel} />
        <SubmitBlocker />
        <Submit label="Create" />
      </div>
    </form>
  </div>
</section>
