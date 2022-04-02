<script lang="ts">
  import { toLocaleTime } from "$lib/common";
  import type { MeetingSchedule222 } from "$lib/types";
  import Join from "$lib/components/common/button-on-click.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: MeetingSchedule222;

  let warning = false;

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

          {#if p.join_as === "host"}
            {#if warning}
              <Warning>The join request is not accepted.</Warning>
            {/if}

            <Join
              label="Join Now"
              on:click={() => {
                join(p.meeting_id);
              }}
            />
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>
