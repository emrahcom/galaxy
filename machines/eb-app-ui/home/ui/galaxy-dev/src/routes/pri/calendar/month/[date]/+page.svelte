<script lang="ts">
  import { page } from "$app/stores";
  import { listByValue } from "$lib/api";
  import { getToday, toLocaleDate } from "$lib/common";
  import List from "$lib/components/pri/calendar/list.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  // Validate the date which comes from the path. Throw an error if the date is
  // not valid to stop execution of remaining codes and wait for redirection.
  try {
    const date = toLocaleDate($page.params.date);

    if (date != $page.params.date) {
      window.location.href = `/pri/calendar/month/${date}`;
      throw new Error("invalid date format");
    }
  } catch {
    const date = getToday();
    window.location.href = `/pri/calendar/month/${date}`;
    throw new Error("invalid date");
  }

  const date = $page.params.date;

  // use any date within the month
  const pr = listByValue("/api/pri/calendar/list/bymonth", date, 500);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="My calendar" hrefMeeting="/pri/meeting" />

{#await pr then calendar}
  <List {date} {calendar} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
