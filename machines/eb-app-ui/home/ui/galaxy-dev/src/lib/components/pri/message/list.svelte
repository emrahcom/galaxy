<script lang="ts">
  import type { IntercomMessage222 } from "$lib/types";
  import Call from "$lib/components/pri/message/call.svelte";
  import Phone from "$lib/components/pri/message/phone.svelte";

  interface Props {
    messages: IntercomMessage222[];
  }

  let { messages }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<div id="messages" class="toast-container bottom-0 end-0 p-3">
  {#each messages as msg (msg.id)}
    {#if msg.message_type === "call"}
      <Call {msg} />
    {:else if msg.message_type === "phone"}
      <Phone {msg} />
    {/if}
  {/each}
</div>
