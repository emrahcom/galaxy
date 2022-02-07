<script lang="ts">
  import type { Message } from "$lib/kratos-types";

  export let messages: Message[];
</script>

<!-- -------------------------------------------------------------------------->
{#if messages}
  {#each messages as msg}
    <div class="alert alert-warning small mb-1" role="alert">
      {msg.text}
    </div>
  {/each}
{/if}
