<script lang="ts">
  import { epochToIntervalString, toLocaleTime } from "$lib/common";
  import type { MeetingSchedule222 } from "$lib/types";
  import Back from "$lib/components/common/button-on-click.svelte";
  import Join from "$lib/components/common/button-on-click.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: MeetingSchedule222;

  let warning = false;

  // ---------------------------------------------------------------------------
  function goBack() {
    window.location.href = `/pri/meeting`;
  }

  // ---------------------------------------------------------------------------
  async function join(meetingId: string) {
    try {
      warning = false;
      window.location.href = `/pri/meeting/join/${meetingId}`;
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="waiting">
  <div class="row mx-auto mt-2">
    <div class="col">
      <div class="card border-0">
        <div class="card-body text-center">
          <h2 class="card-title text-muted mt-3 mb-4">
            {epochToIntervalString(p.waiting_time)}
          </h2>

          <h5 class="card-title text-muted">{p.meeting_name}</h5>

          {#if p.schedule_name}
            <h5 class="card-title text-muted">{p.schedule_name}</h5>
          {/if}

          <p class="card-text text-muted small">
            {toLocaleTime(p.started_at)}
          </p>

          {#if p.meeting_info}
            {#each p.meeting_info.split("\n") as line}
              <p class="card-text text-muted my-0">{line}&nbsp;</p>
            {/each}
          {/if}

          <div class="card-footer bg-body border-0 text-center mt-3">
            <Back label="Back" on:click={goBack} />
            <Join
              label="Join Now"
              on:click={() => {
                join(p.meeting_id);
              }}
            />
          </div>
        </div>
      </div>
    </div>

    {#if warning}
      <Warning>The join request is not accepted.</Warning>
    {/if}
  </div>
</section>
