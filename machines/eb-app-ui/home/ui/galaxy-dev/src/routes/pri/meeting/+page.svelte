<script lang="ts">
  import { list } from "$lib/api";
  import List from "$lib/components/pri/meeting/list.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const pr1 = list("/api/pri/meeting/list", 100);
  const pr2 = list("/api/pri/meeting/member/candidacy/list", 100);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader
  subheader="My meetings"
  hrefAdd="/pri/meeting/add"
  hrefAddTitle="Add a new meeting"
  hrefCalendar="/pri/calendar/month"
  hrefCalendarTitle="Show calendar"
/>

{#await Promise.all([pr1, pr2]) then [meetings, candidacies]}
  <List {meetings} {candidacies} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
