<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    effect?: string;
  }

  let { children, effect = "border" }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<div class="d-flex justify-content-center my-5">
  <div class="spinner-{effect} text-secondary" role="status">
    <span class="visually-hidden">
      {@render children()}
    </span>
  </div>
</div>
