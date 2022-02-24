<script lang="ts">
  import type { Profile } from "$lib/pri/profile";

  export let profiles: Profile[];
</script>

<!-- -------------------------------------------------------------------------->
{#each profiles as p}
  {p.id}<br />
  {p.name}<br />
  {p.email}<br />
  {p.is_default}<br />
  <br />
{/each}
