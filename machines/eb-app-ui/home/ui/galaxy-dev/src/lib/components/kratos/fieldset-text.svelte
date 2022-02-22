<script lang="ts">
  import Messages from "$lib/components/kratos/messages.svelte";
  import type { Node } from "$lib/kratos/types";

  export let node: Node;

  const attr = node.attributes;
  let labelText: string;
  let inputType: string;

  try {
    labelText = node.meta.label.text;
    if (labelText === "ID") labelText = "Email";
  } catch {
    labelText = attr.name;
  }

  inputType = "text";
  if (labelText === "Email") inputType = "email";
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating my-3">
  <input
    type={inputType}
    id={attr.name}
    class="form-control"
    name={attr.name}
    value={attr.value || ""}
    placeholder={labelText}
    disabled={attr.disabled}
    required={attr.required}
  />
  <label for={attr.name}>{labelText}</label>
</div>

<Messages messages={node.messages} />
