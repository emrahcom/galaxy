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
  {#each WEEKS as week}
    {week} -
    {#each DAYS as day}
      {day},
    {/each}
    <br />
  {/each}
</section>
