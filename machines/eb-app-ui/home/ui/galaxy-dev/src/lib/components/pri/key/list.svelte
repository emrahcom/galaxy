<script lang="ts">
  import type { IdentityKey } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Item from "$lib/components/pri/key/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    keys: IdentityKey[];
  }

  let { keys }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each keys as p}
      <Item {p} />
    {:else}
      <Warning>
        There is no key in the list. Click <Add href="/pri/key/add" />
        to add a new private key.
      </Warning>
    {/each}
  </div>
</section>
