<script lang="ts">
  import { page } from "$app/stores";
  import { toLocaleTime } from "$lib/common";
  import type { MeetingSchedule } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Del from "$lib/components/common/link-del.svelte";
  import Update from "$lib/components/common/link-update.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let schedules: MeetingSchedule[];
  const meeting_id = $page.params.meeting_uuid;
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each schedules as p}
      <div class="col-md-6 col-xl-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title text-muted">
              {toLocaleTime(p.started_at)}
            </h5>

            <p class="card-text text-muted">{p.duration} mins</p>

            {#if p.name}
              <p class="card-text text-muted">{p.name}</p>
            {/if}
          </div>

          <div class="card-footer bg-body border-0 text-center">
            <Del href="/pri/meeting/schedule/del/{p.id}" />
            <Update href="/pri/meeting/schedule/update/{p.id}" />
          </div>
        </div>
      </div>
    {:else}
      <Warning>
        This meeting has no schedules. Click
        <Add href="/pri/meeting/schedule/add/{meeting_id}" /> to create a new schedule.
      </Warning>
    {/each}
  </div>
</section>
