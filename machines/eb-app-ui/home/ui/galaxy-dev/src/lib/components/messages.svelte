<script lang="ts">
  import type { Message } from "$lib/kratos-types";

  export let messages: Message[];
</script>

<!-- -------------------------------------------------------------------------->
{#if messages}
  {#each messages as msg}
    {msg.id} -
    {msg.type} -
    {msg.text}<br />
  {/each}
{/if}
