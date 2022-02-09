<script lang="ts">
  import type { Node } from "$lib/kratos-types";

  export let node: Node;

  const attr = node.attributes;
  let labelText: string;

  try {
    labelText = node.meta.label.text;
  } catch {
    labelText = "Submit";
  }
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating mb-3">
  <button
    type="submit"
    class="btn btn-secondary"
    name={attr.name}
    value={attr.value}
  >
    {labelText}
  </button>
</div>
