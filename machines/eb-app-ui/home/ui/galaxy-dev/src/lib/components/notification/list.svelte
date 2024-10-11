<script lang="ts">
  import type { IntercomMessage } from "$lib/types";
  import Call from "$lib/components/notification/call.svelte";

  export let notifications: IntercomMessage[];
</script>

<!-- -------------------------------------------------------------------------->
<div id="notifications" class="toast-container bottom-0 end-0 p-3">
  {#each notifications as notification}
    {#if notification.message_type === "call"}
      <Call bind:notification />
    {/if}
  {/each}
</div>
