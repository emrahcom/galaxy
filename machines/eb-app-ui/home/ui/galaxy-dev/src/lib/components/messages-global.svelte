<script lang="ts">
  import type { Message } from "$lib/kratos-types";

  export let messages: Message[];
</script>

<!-- -------------------------------------------------------------------------->
{#if messages}
  {#each messages as msg}
    <div class="alert alert-warning d-flex align-items-center" role="alert">
      <h2><i class="bi bi-exclamation-triangle-fill" role="img" /></h2>
      {msg.text}
    </div>
  {/each}
{/if}
