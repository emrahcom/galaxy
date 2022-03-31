<script lang="ts">
  import { page } from "$app/stores";
  import { getByCode } from "$lib/api";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const meetingId = $page.params.meeting_uuid;

  const pr = getByCode("/api/pri/meeting/get/schedule", meedingId);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Welcome to the meeting" />

{#await pr then meeting}
  {console.log(meeting)}
{:catch}
  <Warning>Invite code is not accepted</Warning>
{/await}
