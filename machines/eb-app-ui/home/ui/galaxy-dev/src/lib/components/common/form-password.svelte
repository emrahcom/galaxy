<script lang="ts">
  interface Props {
    disabled?: boolean;
    label: string;
    name: string;
    readonly?: boolean;
    required?: boolean;
    value: string;
  }

  let {
    label,
    name,
    disabled = false,
    readonly = false,
    required = false,
    value = $bindable(),
  }: Props = $props();

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
