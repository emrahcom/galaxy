<script lang="ts">
  import { onMount } from "svelte";
  import { activateTooltips } from "$lib/common";

  export let href: string;
  export let title = "Set as guest";

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
  G
</a>
