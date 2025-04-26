<script lang="ts">
  import type { Contact } from "$lib/types";
  import Item from "$lib/components/pri/contact/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    contacts: Contact[];
  }

  let { contacts }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each contacts as p (p.id)}
      <Item {p} />
    {:else}
      <Warning>There is no contact in the list.</Warning>
    {/each}
  </div>
</section>
