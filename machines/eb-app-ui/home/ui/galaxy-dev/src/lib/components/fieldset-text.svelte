<script lang="ts">
  import Messages from "$lib/components/messages.svelte";
  import type { Node } from "$lib/kratos-types";

  export let node: Node;

  const attr = node.attributes;
  let labelText: string;

  try {
    labelText = node.meta.label.text;
  } catch {
    labelText = attr.name;
  }
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating mb-3">
  <input
    type="text"
    id={labelText}
    class="form-control"
    name={attr.name}
    value={attr.value || ""}
    placeholder={labelText}
    disabled={attr.disabled}
    required={attr.required}
  />
  <label for={labelText}>{labelText}</label>
  <Messages messages={node.messages} />
  TEXT
</div>
