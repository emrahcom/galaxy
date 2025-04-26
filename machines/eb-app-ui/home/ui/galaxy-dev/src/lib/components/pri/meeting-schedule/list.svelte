<script lang="ts">
  import { page } from "$app/stores";
  import type { MeetingSchedule } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Item from "$lib/components/pri/meeting-schedule/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    schedules: MeetingSchedule[];
  }

  let { schedules }: Props = $props();

  const meeting_id = $page.params.meeting_uuid;
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each schedules as p (p.id)}
      <Item {p} />
    {:else}
      <Warning>
        This meeting does not have a schedule. Click
        <Add href="/pri/meeting/schedule/add/{meeting_id}" /> to create a new schedule.
      </Warning>
    {/each}
  </div>
</section>
