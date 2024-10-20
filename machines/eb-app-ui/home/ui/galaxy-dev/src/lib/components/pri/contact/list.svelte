<script lang="ts">
  import type { Contact } from "$lib/types";
  import Item from "$lib/components/pri/contact/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  export let contacts: Contact[];
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each contacts as p}
      <Item {p} />
    {:else}
      <Warning>There is no contact in the list.</Warning>
    {/each}
  </div>
</section>
