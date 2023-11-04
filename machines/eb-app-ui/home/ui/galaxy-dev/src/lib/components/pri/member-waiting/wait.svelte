<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { epochToIntervalString, toLocaleTime } from "$lib/common";
  import { getById } from "$lib/api";
  import type { MeetingSchedule222 } from "$lib/types";
  import Back from "$lib/components/common/button-on-click.svelte";
  import Join from "$lib/components/common/button-on-click.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let p: MeetingSchedule222;
  const REFRESH_SEC = 60;

  let warning = false;
  let started_at = new Date(Date.now() + p.waiting_time * 1000);
  let remainingTime = "";
  let counter = 0;

  getRemainingTime();

  // ---------------------------------------------------------------------------
  async function getRemainingTime() {
    const interval = (started_at.getTime() - Date.now()) / 1000;

    if (interval < 0) {
      join(p.id);
      return;
    }

    counter++;
    if (counter > REFRESH_SEC) {
      counter = 0;

      await getById("/api/pri/meeting/schedule/get/bymembership", p.id)
        .then((s) => {
          p = s;
          started_at = new Date(Date.now() + p.waiting_time * 1000);
        })
        .catch(() => {
          // do nothing
        });
    }

    remainingTime = epochToIntervalString(interval);

    setTimeout(getRemainingTime, 1000);
  }

  // ---------------------------------------------------------------------------
  function goBack() {
    window.location.href = `/pri/meeting`;
  }

  // ---------------------------------------------------------------------------
  async function join(membershipId: string) {
    try {
      warning = false;
      window.location.href = `/pri/member/join/${membershipId}`;
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="waiting">
  <div class="d-flex mt-2 justify-content-center">
    <div class="card border-0 mx-auto" style="max-width:{FORM_WIDTH};">
      <div class="card-body text-center">
        <h2 class="card-title text-muted bg-light mt-2 mb-3 py-3">
          {remainingTime}
        </h2>

        <h5 class="card-title text-muted">{p.meeting_name}</h5>

        {#if p.schedule_name}
          <h5 class="card-title text-muted">{p.schedule_name}</h5>
        {/if}

        <p class="card-text text-muted small">
          {toLocaleTime(p.started_at)}
        </p>

        {#if p.meeting_info}
          <p
            class="d-inline-block card-text text-muted text-start text-truncate bg-light w-auto"
            style="max-width: 90%; white-space: pre"
          >
            {p.meeting_info}
          </p>
        {/if}

        <div
          class="card-footer d-flex justify-content-center bg-body border-0
          mt-3 gap-5"
        >
          <Back label="Back" on:click={goBack} />

          {#if p.join_as === "host"}
            <Join
              label="Join Now"
              on:click={() => {
                join(p.id);
              }}
            />
          {/if}
        </div>
      </div>
    </div>

    {#if warning}
      <Warning>The join request is not accepted.</Warning>
    {/if}
  </div>
</section>
