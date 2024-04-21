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

  const date = $page.params.date;
  const firstOfMonth = firstDayOfMonth(date);
  const firstOfWeek = firstDayOfWeek(firstOfMonth);

  console.error($page.params.date);
  console.error(date);
  console.error(firstOfMonth);
  console.error(firstOfWeek);

  // use any date inside the month
  const pr = listByValue("/api/pri/calendar/listbymonth", date, 500);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="My calendar" />

{#await pr then calendar}
  Month
  {console.error(calendar)}
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
