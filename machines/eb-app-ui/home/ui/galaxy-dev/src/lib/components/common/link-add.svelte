<script lang="ts">
  import { onMount } from "svelte";
  import { activateTooltips } from "$lib/common";

  export let href: string;

  onMount(() => {
    activateTooltips();
  });
</script>

<!-- -------------------------------------------------------------------------->
<a {href} class="btn btn-outline-dark btn-sm mx-2" role="button">
  <i class="bi bi-plus" />
</a>
