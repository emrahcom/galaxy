<script lang="ts">
  import type { Phone } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Item from "$lib/components/pri/phone/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    phones: Phone[];
  }

  let { phones }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each phones as p}
      <Item {p} />
    {:else}
      <Warning>
        There is no phone in the list. Click <Add href="/pri/phone/add" />
        to add a new virtual phone and share its link with your friends.
      </Warning>
    {/each}
  </div>
</section>
