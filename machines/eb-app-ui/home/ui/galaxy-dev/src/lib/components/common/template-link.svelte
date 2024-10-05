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
<!--
  There are href and window.location at the same time to prevent undeleted
  tooltip issue. Otherwise the tooltip stays visible in the next page after the
  click.

  Href is required to allow the link to open in a new tab.
-->
<a
  class="btn btn-outline-dark btn-sm"
  data-bs-toggle="tooltip"
  data-bs-title={title}
  {href}
  on:click={(e) => {
    if (e.ctrlKey || e.metaKey) return;

    e.preventDefault();
    window.location.href = href;
  }}
>
  <i class="bi {icon}" />
</a>
