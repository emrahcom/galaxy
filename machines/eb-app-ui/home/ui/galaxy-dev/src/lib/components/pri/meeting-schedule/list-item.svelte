<script lang="ts">
  import { isAllDay, showLocaleDate, showLocaleDatetime } from "$lib/common";
  import type { MeetingSchedule } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";
  import Disable from "$lib/components/common/link-disable.svelte";
  import Enable from "$lib/components/common/link-enable.svelte";
  import Update from "$lib/components/common/link-update.svelte";

  interface Props {
    p: MeetingSchedule;
  }

  let { p }: Props = $props();

  // ---------------------------------------------------------------------------
  function getDays(repDays: string) {
    if (!repDays.match("^[01]{7}$")) return "";

    let day = "";
    let days = "";
    for (let i = 0; i < 7; i++) {
      if (repDays[i] !== "1") continue;

      if (i === 0) {
        day = "Sunday";
      } else if (i === 1) {
        day = "Monday";
      } else if (i === 2) {
        day = "Tuesday";
      } else if (i === 3) {
        day = "Wednesday";
      } else if (i === 4) {
        day = "Thursday";
      } else if (i === 5) {
        day = "Friday";
      } else if (i === 6) {
        day = "Saturday";
      }

      if (days) {
        if (repDays.slice(i + 1).match("1")) {
          days = `${days}, ${day}`;
        } else {
          days = `${days} and ${day}`;
        }
      } else {
        days = day;
      }
    }

    return days;
  }
</script>

<!-- -------------------------------------------------------------------------->
<div class="col-md-6 col-xl-4">
  <div class="card h-100 {p.enabled ? '' : 'border-danger'}">
    <div class="card-body text-center">
      {#if isAllDay(p.schedule_attr.started_at, p.schedule_attr.duration)}
        <h5 class="card-title text-muted">
          {showLocaleDate(p.session_at)}
        </h5>

        <p class="card-text text-muted">All day</p>
      {:else}
        <h5 class="card-title text-muted">
          {showLocaleDatetime(p.session_at)}
        </h5>

        <p class="card-text text-muted">
          {p.schedule_attr.duration} mins
        </p>
      {/if}

      {#if p.name}
        <p class="card-text text-muted">{p.name}</p>
      {/if}

      {#if p.schedule_attr.type === "d"}
        {#if p.session_remaining === 1}
          <p class="card-text text-muted">last session in the series</p>
        {:else if p.schedule_attr.rep_every === "1"}
          <p class="card-text text-muted">
            repeat every day<br />
            {p.session_remaining} sessions remaining
          </p>
        {:else}
          <p class="card-text text-muted">
            repeat every {p.schedule_attr.rep_every} days<br />
            {p.session_remaining} sessions remaining
          </p>
        {/if}
      {:else if p.schedule_attr.type === "w"}
        {#if p.session_remaining === 1}
          <p class="card-text text-muted">last session in the series</p>
        {:else if p.schedule_attr.rep_every === "1"}
          <p class="card-text text-muted">
            repeat every week on
            {getDays(p.schedule_attr.rep_days)}<br />
            {p.session_remaining} sessions remaining
          </p>
        {:else}
          <p class="card-text text-muted">
            repeat every {p.schedule_attr.rep_every} weeks on
            {getDays(p.schedule_attr.rep_days)}<br />
            {p.session_remaining} sessions remaining
          </p>
        {/if}
      {/if}
    </div>

    <div class="card-footer bg-body border-0 text-center">
      <Del href="/pri/meeting/schedule/del/{p.id}" />

      {#if p.enabled}
        <Disable href="/pri/meeting/schedule/disable/{p.id}" />
      {:else}
        <Enable href="/pri/meeting/schedule/enable/{p.id}" />
      {/if}

      <Update href="/pri/meeting/schedule/update/{p.id}" />
    </div>
  </div>
</div>
