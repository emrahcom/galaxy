<script lang="ts">
  export let label: string;
  export let name: string;
  export let disabled = false;
  export let readonly = false;
  export let required = false;
  export let value: string;

  let isHidden = $state(true);

  // ---------------------------------------------------------------------------
  function toggleVisibility() {
    isHidden = !isHidden;
  }
</script>

<!-- -------------------------------------------------------------------------->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="form-floating d-flex my-3">
  {#if isHidden}
    <input
      type="password"
      id={name}
      class="form-control"
      {name}
      placeholder=""
      bind:value
      {disabled}
      {readonly}
      {required}
    />
  {:else}
    <input
      type="text"
      id={name}
      class="form-control"
      {name}
      placeholder=""
      bind:value
      {disabled}
      {readonly}
      {required}
    />
  {/if}
  <label for={name}>{label}</label>

  <span
    class="input-group-text"
    role="button"
    tabindex="0"
    on:click={toggleVisibility}
  >
    {#if isHidden}
      <i class="bi bi-eye-fill"></i>
    {:else}
      <i class="bi bi-eye-slash-fill"></i>
    {/if}
  </span>
</div>
