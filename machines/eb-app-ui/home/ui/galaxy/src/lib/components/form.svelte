<script lang="ts">
  import Fieldsets from "$lib/components/fieldsets.svelte";
  import MessagesGlobal from "$lib/components/messages-global.svelte";
  import type { KratosForm } from "$lib/kratos-types";

  export let dm: KratosForm;
  export let groups: string[];
  export let disableGlobalMessages = false;

  const nodes = dm.ui.nodes.filter(
    (n) => n.type === "input" && groups.includes(n.group),
  );
</script>

<!-- -------------------------------------------------------------------------->
{#if !disableGlobalMessages}
  <MessagesGlobal messages={dm.ui.messages} />
{/if}

<div id="ui">
  <form action={dm.ui.action} method={dm.ui.method}>
    <Fieldsets {nodes} />
  </form>
</div>
