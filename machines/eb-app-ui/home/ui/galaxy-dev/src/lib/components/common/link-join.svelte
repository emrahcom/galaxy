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
<a
  {href}
  class="btn btn-outline-dark btn-sm"
  role="button"
  data-bs-toggle="tooltip"
  data-bs-title={title}
>
  <i class="bi bi-link-45deg" />
</a>
