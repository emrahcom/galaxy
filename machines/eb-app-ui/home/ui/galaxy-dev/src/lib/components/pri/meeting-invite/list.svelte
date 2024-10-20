<script lang="ts">
  import { page } from "$app/stores";
  import type { MeetingInvite } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Item from "$lib/components/pri/meeting-invite/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let invites: MeetingInvite[];
  const meeting_id = $page.params.meeting_uuid;
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each invites as p}
      <Item {p} />
    {:else}
      <Warning>
        This meeting does not have a participant key. Click
        <Add href="/pri/meeting/invite/add/{meeting_id}" /> to create a new participant
        key and share it with your participant.
      </Warning>
    {/each}
  </div>
</section>
