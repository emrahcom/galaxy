<script lang="ts">
  import { page } from "$app/stores";
  import { listByValue } from "$lib/api";
  import {
    firstDayOfMonth,
    firstDayOfWeek,
    today,
    toLocaleDate,
  } from "$lib/common";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  // validate date which comes from the path
  try {
    const date = toLocaleDate($page.params.date);

    if (date != $page.params.date) {
      window.location.href = `/pri/calendar/month/${date}`;
    }
  } catch {
    const date = today();
    window.location.href = `/pri/calendar/month/${date}`;
  }

  const DAYS = [0, 1, 2, 3, 4, 5, 6];
  const WEEKS = [0, 1, 2, 3, 4, 5];
  const date = $page.params.date;
  const firstOfMonth = firstDayOfMonth(date);
  const firstOfWeek = firstDayOfWeek(firstOfMonth);

  console.error($page.params.date);
  console.error(date);
  console.error(firstOfMonth);
  console.error(firstOfWeek);

  // use any date inside the month
  const pr = listByValue("/api/pri/calendar/list/bymonth", date, 500);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="My calendar" />

{#await pr then calendar}
  {#each WEEKS as week}
    {#each DAYS as day}
      .
    {/each}
    <br />
  {/each}
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
