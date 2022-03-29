<script lang="ts">
  import { toLocaleTime } from "$lib/common";
  import type { MeetingSchedule } from "$lib/types";
  import Del from "$lib/components/common/link-del.svelte";
  import Update from "$lib/components/common/link-update.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let schedules: MeetingSchedule[];
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
            <p class="card-text text-muted">{p.name}</p>
          </div>

          <div class="card-footer bg-body border-0 text-center">
            <Del href="/pri/meeting/schedule/del/{p.id}" />
            <Update href="/pri/meeting/schedule/update/{p.id}" />
          </div>
        </div>
      </div>
    {:else}
      <Warning>No schedule found for this meeting</Warning>
    {/each}
  </div>
</section>
