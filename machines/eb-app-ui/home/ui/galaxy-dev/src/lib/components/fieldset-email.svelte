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
<fieldset>
  <label>
    <span>{labelText}</span>
    <input
      type="email"
      name={attr.name}
      value={attr.value || ""}
      placeholder={labelText}
      disabled={attr.disabled}
      required={attr.required}
    />
  </label>

  <Messages messages={node.messages} />
</fieldset>
