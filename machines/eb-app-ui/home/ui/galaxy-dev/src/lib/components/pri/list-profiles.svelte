<script lang="ts">
  import type { profile } from "$lib/pri/profile";

  export let profiles: profile[];
</script>

<!-- -------------------------------------------------------------------------->
{#each profiles as p}
  {p.id}<br />
  {p.name}<br />
  {p.email}<br />
  {p.is_default}<br />
  <br />
{/each}
