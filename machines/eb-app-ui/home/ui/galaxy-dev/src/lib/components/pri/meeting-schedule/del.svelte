<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { actionById } from "$lib/api";
  import { toInputTime } from "$lib/common";
  import type { MeetingSchedule } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Datetime from "$lib/components/common/form-datetime.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: MeetingSchedule;

  const min = toInputTime();
  let started_at = toInputTime(p.schedule_attr.started_at);
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
      <Text
        name="name"
        label="Tag (optional)"
        value={p.name}
        disabled={true}
        readonly={true}
      />
      <Datetime
        name="started_at"
        label="Time"
        value={started_at}
        {min}
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
