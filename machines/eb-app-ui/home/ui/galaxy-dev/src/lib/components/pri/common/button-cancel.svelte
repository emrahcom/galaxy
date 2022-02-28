<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let label = "Cancel";
</script>

<!-- -------------------------------------------------------------------------->
<button
  class="btn btn-outline-secondary"
  type="button"
  on:click={() => dispatch("click")}
>
  {label}
</button>
