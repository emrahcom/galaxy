<script lang="ts">
  import { onMount } from "svelte";
  import { activateTooltips } from "$lib/common";

  interface Props {
    href: string;
    icon?: string;
    title?: string;
  }

  let { href, icon = "bi-question", title = "?" }: Props = $props();

  onMount(() => {
    setTimeout(activateTooltips, 200);
  });
</script>

<!-- -------------------------------------------------------------------------->
<!--
  There are href and globalThis.location at the same time to prevent undeleted
  tooltip issue. Otherwise the tooltip stays visible in the next page after the
  click.

  Href is required to allow the link to open in a new tab.
-->
<a
  class="btn btn-outline-dark btn-sm"
  data-bs-toggle="tooltip"
  data-bs-title={title}
  aria-label={title}
  {href}
  onclick={(e) => {
    if (e.ctrlKey || e.metaKey) return;

    e.preventDefault();
    globalThis.location.href = href;
  }}
>
  <i class="bi {icon}"></i>
</a>
