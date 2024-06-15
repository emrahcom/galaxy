<script lang="ts">
  import {
    getFirstDayOfMonth,
    getFirstDayOfWeek,
    getToday,
    toLocaleDate,
  } from "$lib/common";
  import Day from "$lib/components/pri/calendar/day-of-month.svelte";
  import type { MeetingSchedule222 } from "$lib/types";

  export let date: string;
  export let calendar: MeetingSchedule222[];

  const DAYS = [0, 1, 2, 3, 4, 5, 6];
  const WEEKS = [0, 1, 2, 3, 4, 5];

  const calendarDay = toLocaleDate(date);
  const firstOfMonth = getFirstDayOfMonth(date);
  const firstDay = getFirstDayOfWeek(firstOfMonth);
  const today = getToday();
</script>

<!-- -------------------------------------------------------------------------->
<section id="list" class="h-100">
  <div class="row mx-auto mt-2" style="height:98%">
    <table class="table table-bordered h-100" style="table-layout: fixed">
      <thead>
        <tr>
          <th scope="col">Sun</th>
          <th scope="col">Mon</th>
          <th scope="col">Tue</th>
          <th scope="col">Wed</th>
          <th scope="col">Thu</th>
          <th scope="col">Fri</th>
          <th scope="col">Sat</th>
        </tr>
      </thead>
      <tbody>
        {#each WEEKS as week}
          <tr style="height:86px">
            {#each DAYS as day}
              <td class="p-0">
                <Day {calendarDay} {today} {firstDay} {week} {day} {calendar} />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
