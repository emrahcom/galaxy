<script lang="ts">
  import Hidden from "$lib/components/kratos/fieldset-hidden.svelte";
  import Password from "$lib/components/kratos/fieldset-password.svelte";
  import Text from "$lib/components/kratos/fieldset-text.svelte";
  import Email from "$lib/components/kratos/fieldset-email.svelte";
  import Submit from "$lib/components/kratos/fieldset-submit.svelte";
  import type { Node } from "$lib/kratos/types";

  export let nodes: Node[];
</script>

<!-- -------------------------------------------------------------------------->
{#each nodes as node}
  {#if node.attributes.type === "hidden"}
    <Hidden {node} />
  {:else if node.attributes.type === "password"}
    <Password {node} />
  {:else if node.attributes.type === "text"}
    <Text {node} />
  {:else if node.attributes.type === "email"}
    <Email {node} />
  {:else if node.attributes.type === "submit"}
    <Submit {node} />
  {:else}
    unknow type
  {/if}
{/each}
