<script lang="ts">
  import { page } from "$app/stores";
  import identity from "$lib/stores/kratos/identity";
  import Messages from "$lib/components/kratos/messages.svelte";
  import type { Node } from "$lib/kratos-types";

  export let node: Node;

  const attr = node.attributes;
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating my-3">
  {#if $page.url.pathname === "/verification"}
    <input
      type="email"
      id="email"
      class="form-control"
      name={attr.name}
      value={$identity.traits.email}
      placeholder="email"
      readonly
      required={attr.required}
    />
  {:else}
    <input
      type="email"
      id="email"
      class="form-control"
      name={attr.name}
      value={attr.value || ""}
      placeholder="email"
      disabled={attr.disabled}
      required={attr.required}
    />
  {/if}
  <label for="email">Email</label>
</div>

<Messages messages={node.messages} />
