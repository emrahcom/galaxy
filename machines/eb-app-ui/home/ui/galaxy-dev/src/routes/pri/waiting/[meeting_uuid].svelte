<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Wait from "$lib/components/pri/waiting/wait.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const meetingId = $page.params.meeting_uuid;

  const pr = getById("/api/pri/meeting/schedule/get/bymeeting", meetingId);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Welcome to the waiting room" />

{#await pr then schedule}
  <Wait p={schedule} />
{:catch}
  <Warning>No scheduled meeting found</Warning>
{/await}
