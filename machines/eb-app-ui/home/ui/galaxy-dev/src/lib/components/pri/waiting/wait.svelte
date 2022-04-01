<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import type { MeetingSchedule222 } from "$lib/types";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: MeetingSchedule222;

  let warning = false;

  // ---------------------------------------------------------------------------
  async function onSubmit() {
    try {
      warning = false;
      window.location.href = "/pri/meeting";
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="del">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text name="name" label="Name" value={p.meeting_name} readonly={true} />
      <SubmitBlocker />

      {#if p.join_as === "host"}
        {#if warning}
          <Warning>The join request is not accepted.</Warning>
        {/if}

        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Submit label="Join" />
        </div>
      {/if}
    </form>
  </div>
</section>
