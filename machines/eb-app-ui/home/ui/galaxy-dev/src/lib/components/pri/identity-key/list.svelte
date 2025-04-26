<script lang="ts">
  import type { IdentityKey333 } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Item from "$lib/components/pri/identity-key/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    keys: IdentityKey333[];
  }

  let { keys }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each keys as p (p.id)}
      <Item {p} />
    {:else}
      <Warning>
        There is no key in the list. Click <Add href="/pri/identity/key/add" />
        to add a new private key.
      </Warning>
    {/each}
  </div>
</section>
