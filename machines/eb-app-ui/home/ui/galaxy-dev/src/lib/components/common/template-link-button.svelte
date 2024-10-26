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
<button
  class="btn btn-outline-dark btn-sm"
  data-bs-toggle="tooltip"
  data-bs-title={title}
  aria-label={title}
  onclick={() => {
    globalThis.location.href = href;
  }}
>
  <i class="bi {icon}"></i>
</button>
