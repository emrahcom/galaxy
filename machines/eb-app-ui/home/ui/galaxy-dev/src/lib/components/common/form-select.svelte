<script lang="ts">
  interface Props {
    disabled?: boolean;
    id: string;
    label: string;
    options: string[][];
    required?: boolean;
    value: string;
  }

  let {
    disabled = false,
    id,
    label,
    options,
    required = true,
    value = $bindable(),
  }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating my-3">
  <select
    class="form-select"
    {id}
    bind:value
    aria-label={label}
    {disabled}
    {required}
  >
    <option class="bg-body"></option>

    {#each options as opt (opt[0])}
      <option value={opt[0]}>{opt[1]}</option>
    {/each}
  </select>
  <label for={id}>{label}</label>
</div>
