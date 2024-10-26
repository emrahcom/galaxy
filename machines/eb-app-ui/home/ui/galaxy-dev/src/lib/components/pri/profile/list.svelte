<script lang="ts">
  import type { Profile } from "$lib/types";
  import Add from "$lib/components/common/link-add.svelte";
  import Item from "$lib/components/pri/profile/list-item.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    profiles: Profile[];
  }

  let { profiles }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<section id="list">
  <div class="row mx-auto mt-2 g-3">
    {#each profiles as p}
      <Item {p} />
    {:else}
      <Warning>
        There is no profile in the list. Click <Add href="/pri/profile/add" />
        to add a new profile.
      </Warning>
    {/each}
  </div>
</section>
