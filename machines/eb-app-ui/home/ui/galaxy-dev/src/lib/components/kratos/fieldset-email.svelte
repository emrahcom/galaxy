<script lang="ts">
  import Messages from "$lib/components/kratos/messages.svelte";
  import type { Node } from "$lib/kratos-types";

  export let node: Node;

  const attr = node.attributes;
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating my-3">
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
  <label for="email">Email</label>
</div>

<Messages messages={node.messages} />
