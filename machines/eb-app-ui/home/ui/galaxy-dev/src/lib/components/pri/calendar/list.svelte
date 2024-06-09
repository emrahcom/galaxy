<script lang="ts">
  import { getFirstDayOfMonth, getFirstDayOfWeek, getToday } from "$lib/common";
  import Day from "$lib/components/pri/calendar/day-of-month.svelte";

  export let date: string;
  export let calendar: string[];

  const DAYS = [0, 1, 2, 3, 4, 5, 6];
  const WEEKS = [0, 1, 2, 3, 4, 5];

  const firstOfMonth = getFirstDayOfMonth(date);
  const firstDay = getFirstDayOfWeek(firstOfMonth);
  const today = getToday();

  console.error(calendar);
</script>

<!-- -------------------------------------------------------------------------->
<section id="list" class="h-100">
  <div class="row mx-auto mt-2" style="height:98%">
    <table class="table table-bordered h-100">
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
          <tr>
            {#each DAYS as day}
              <td class="p-0">
                <Day {today} {firstDay} {week} {day} />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
