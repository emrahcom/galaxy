<script lang="ts">
  import type { Meeting222, MeetingMemberCandidacy } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Candidacy from "$lib/components/pri/meeting/list-item-candidacy.svelte";
  import Item from "$lib/components/pri/meeting/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    meetings: Meeting222[];
    candidacies: MeetingMemberCandidacy[];
  }

  const { meetings, candidacies }: Props = $props();

  const isEmpty = !(meetings.length || candidacies.length);
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each meetings as p (p.id)}
      <Item {p} />
    {/each}

    {#each candidacies as p (p.id)}
      <Candidacy {p} />
    {/each}

    {#if isEmpty}
      <Warning>
        There is no meeting in the list. Click <Add href="/pri/meeting/add" />
        to add a new meeting.
      </Warning>
    {/if}
  </div>
</section>
