<script lang="ts">
  import { onMount } from "svelte";
  import { activateTooltips } from "$lib/common";

  const title = "Go to home page";

  onMount(() => {
    setTimeout(activateTooltips, 200);
  });
</script>

<!-- -------------------------------------------------------------------------->
<button
  class="btn navbar-brand py-0"
  data-bs-toggle="tooltip"
  data-bs-title={title}
  on:click={() => {
    window.location.href = "/";
  }}
>
  <img src="/logo.svg" alt="logo" height="50rem" />
</button>
