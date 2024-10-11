<script lang="ts">
  import { onMount } from "svelte";
  import { activateTooltips } from "$lib/common";

  export let href: string;
  export let icon = "bi-question";
  export let title = "?";

  onMount(() => {
    setTimeout(activateTooltips, 200);
  });
</script>

<!-- -------------------------------------------------------------------------->
<button
  class="btn btn-outline-dark btn-sm"
  data-bs-toggle="tooltip"
  data-bs-title={title}
  on:click={() => {
    globalThis.location.href = href;
  }}
>
  <i class="bi {icon}"></i>
</button>
