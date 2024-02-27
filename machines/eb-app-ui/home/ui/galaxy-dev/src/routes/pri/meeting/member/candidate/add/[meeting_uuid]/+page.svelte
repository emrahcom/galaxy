<script lang="ts">
  import { page } from "$app/stores";
  import { getById } from "$lib/api";
  import Add from "$lib/components/pri/meeting-member-candidate/add.svelte";
  import Subheader from "$lib/components/common/subheader-center.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const meetingId = $page.params.meeting_uuid;

  const pr = getById("/api/pri/meeting/get", meetingId);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="Invite contact to membership" />

{#await pr then meeting}
  <Add {meeting} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
