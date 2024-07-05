<script lang="ts">
  import { onMount } from "svelte";
  import { activateTooltips } from "$lib/common";

  export let href: string;
  export let title = "Set default profile";

  onMount(() => {
    activateTooltips();
  });
</script>

<!-- -------------------------------------------------------------------------->
<a {href} class="btn btn-outline-dark btn-sm" role="button">
  <i class="bi bi-person-check" />
</a>
