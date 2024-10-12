<script lang="ts">
  import type { IntercomMessage } from "$lib/types";
  import Call from "$lib/components/message/call.svelte";

  export let messages: IntercomMessage[];
</script>

<!-- -------------------------------------------------------------------------->
<div id="messages" class="toast-container bottom-0 end-0 p-3">
  {#each messages as msg}
    {#if msg.message_type === "call"}
      <Call bind:msg />
    {/if}
  {/each}
</div>
