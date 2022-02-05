<script lang="ts">
  import Messages from "$lib/components/messages.svelte";
  import PasswordToggle from "$lib/components/fieldset-password-toggle.svelte";
  import type { Node } from "$lib/kratos-types";

  export let node: Node;

  const attr = node.attributes;
  let isHidden = true;
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating mb-3">
  <input
    type={isHidden ? "password" : "text"}
    id="password"
    class="form-control"
    name={attr.name}
    value={attr.value || ""}
    placeholder="password"
    disabled={attr.disabled}
    required={attr.required}
  />
  <label for="password">Password</label>
  <PasswordToggle bind:isHidden />
  <Messages messages={node.messages} />
</div>
