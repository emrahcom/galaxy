<script lang="ts">
  import type { ContactInvite } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Item from "$lib/components/pri/contact-invite/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    invites: ContactInvite[];
  }

  const { invites }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each invites as p (p.id)}
      <Item {p} />
    {:else}
      <Warning>
        You have not a contact key. Click
        <Add href="/pri/contact/invite/add" /> to create a new contact key and share
        it with your friend.
      </Warning>
    {/each}
  </div>
</section>
