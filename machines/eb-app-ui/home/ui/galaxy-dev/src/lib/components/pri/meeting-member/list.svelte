<script lang="ts">
  import type { MeetingMember, MeetingMemberCandidate } from "$lib/types";
  import Candidate from "$lib/components/pri/meeting-member/list-item-candidate.svelte";
  import Item from "$lib/components/pri/meeting-member/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let members: MeetingMember[];
  export let candidates: MeetingMemberCandidate[];

  const isEmpty = !(members.length || candidates.length);
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each members as p}
      <Item {p} />
    {/each}

    {#each candidates as p}
      <Candidate {p} />
    {/each}

    {#if isEmpty}
      <Warning>This meeting does not have a member.</Warning>
    {/if}
  </div>
</section>
