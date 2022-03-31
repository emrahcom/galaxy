<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const meetingId = $page.params.meeting_uuid;

  const pr = getById("/api/pri/meeting/schedule/get/bymeeting", meetingId);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Welcome to the meeting" />

{#await pr then schedule}
  {console.log(schedule)}
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
