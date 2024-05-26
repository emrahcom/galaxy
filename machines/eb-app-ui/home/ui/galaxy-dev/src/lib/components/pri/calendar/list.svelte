<script lang="ts">
  import { firstDayOfMonth, firstDayOfWeek } from "$lib/common";

  export let date: string;
  export let calendar: string[];

  const DAYS = [0, 1, 2, 3, 4, 5, 6];
  const WEEKS = [0, 1, 2, 3, 4, 5];

  const firstOfMonth = firstDayOfMonth(date);
  const firstOfWeek = firstDayOfWeek(firstOfMonth);

  console.error(date);
  console.error(calendar);
  console.error(firstOfMonth);
  console.error(firstOfWeek);
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row">
    <div class="col-12">
      <table>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {#each WEEKS as week}
            <tr>
              {#each DAYS as day}
                <td>{week}-{day}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</section>
