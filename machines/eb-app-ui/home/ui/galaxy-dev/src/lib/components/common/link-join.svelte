<script lang="ts">
  import { onMount } from "svelte";
  import { activateTooltips } from "$lib/common";

  export let href: string;
  export let title = "Join";

  onMount(() => {
    activateTooltips();
  });
</script>

<!-- -------------------------------------------------------------------------->
<button
  class="btn btn-outline-dark btn-sm"
  data-bs-toggle="tooltip"
  data-bs-title={title}
  on:click={() => {
    window.location.href = href;
  }}
>
  <i class="bi bi-link-45deg" />
</button>
