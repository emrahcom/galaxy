<script lang="ts">
  import { page } from "$app/stores";
  import { getById, listById } from "$lib/api";
  import type { Meeting } from "$lib/types";
  import List from "$lib/components/pri/meeting-invite/list.svelte";
  import Subheader from "$lib/components/common/subheader.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const meetingId = $page.params.meeting_uuid;
  let meetingName = $state("");

  const pr1 = getById("/api/pri/meeting/get", meetingId).then(
    (item: Meeting) => {
      meetingName = item.name;
    },
  );
  const pr2 = listById(
    "/api/pri/meeting/invite/list/bymeeting",
    meetingId,
    100,
  );
</script>

<!-- -------------------------------------------------------------------------->
<Subheader
  subheader="Participant keys of {meetingName}"
  hrefAdd="/pri/meeting/invite/add/{meetingId}"
  hrefAddTitle="Add a new participant key (invite link)"
  hrefBack="/pri/meeting"
/>

<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
{#await Promise.all([pr1, pr2]) then [_meeting, invites]}
  <List {invites} />
{:catch}
  <Warning>Something went wrong</Warning>
{/await}
