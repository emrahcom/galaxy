<script lang="ts">
  interface Props {
    disabled?: boolean;
    id: string;
    label: string;
    max?: number;
    min?: number;
    required?: boolean;
    unit: string;
    value: number;
  }

  let {
    disabled = false,
    id,
    label,
    max = 100,
    min = 1,
    required = true,
    unit,
    value = $bindable(),
  }: Props = $props();

  const options = Array.from(
    { length: max - min + 1 },
    (_, index) => min + index,
  );
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
    {#each options as opt (opt)}
      {#if unit}
        <option value={opt}>{opt} {unit}{opt > 1 ? "s" : ""}</option>
      {:else}
        <option value={opt}>{opt}</option>
      {/if}
    {/each}
  </select>
  <label for={id}>{label}</label>
</div>
