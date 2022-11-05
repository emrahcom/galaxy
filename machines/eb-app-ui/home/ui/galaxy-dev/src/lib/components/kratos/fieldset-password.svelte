<script lang="ts">
  import Messages from "$lib/components/kratos/messages.svelte";
  import type { Node } from "$lib/kratos/types";

  export let node: Node;

  const attr = node.attributes;
  let isHidden = true;

  // ---------------------------------------------------------------------------
  function toggleVisibility() {
    isHidden = !isHidden;
  }
</script>

<!-- -------------------------------------------------------------------------->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="form-floating d-flex my-3">
  <input
    type={isHidden ? "password" : "text"}
    id="password"
    class="form-control"
    name={attr.name}
    value={attr.value ?? ""}
    placeholder="password"
    disabled={attr.disabled}
    required={attr.required}
  />
  <label for="password">Password</label>

  <span class="input-group-text" on:click={toggleVisibility}>
    {#if isHidden}
      <span class="bi bi-eye-fill" />
    {:else}
      <span class="bi bi-eye-slash-fill" />
    {/if}
  </span>
</div>

<Messages messages={node.messages} />
