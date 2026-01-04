<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  const { children }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<div class="d-flex justify-content-center my-5">
  <div class="alert alert-warning text-center my-auto px-5" role="alert">
    {@render children()}
  </div>
</div>
