<script lang="ts">
  import { page } from "$app/stores";
  import { listByValue } from "$lib/api";
  import { today, toLocaleDate } from "$lib/common";
  import List from "$lib/components/pri/calendar/list.svelte";
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

  // use any date inside the month
  const pr = listByValue("/api/pri/calendar/list/bymonth", date, 500);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="My calendar" />

{#await pr then calendar}
  <List {date} {calendar} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
