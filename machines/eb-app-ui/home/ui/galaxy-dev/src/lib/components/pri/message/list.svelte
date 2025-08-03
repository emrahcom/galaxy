<script lang="ts">
  import type { IntercomMessage222 } from "$lib/types";
  import Call from "$lib/components/pri/message/call.svelte";
  import Phone from "$lib/components/pri/message/phone.svelte";
  import Text from "$lib/components/pri/message/text.svelte";

  interface Props {
    messages: IntercomMessage222[];
  }

  let { messages }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<div id="messages" class="toast-container bottom-0 end-0 p-3 bg-white">
  {#each messages as msg (msg.id)}
    {#if msg.message_type === "call"}
      <Call {msg} />
    {:else if msg.message_type === "phone"}
      <Phone {msg} />
    {:else if msg.message_type === "text"}
      <Text {msg} />
    {/if}
  {/each}
</div>
