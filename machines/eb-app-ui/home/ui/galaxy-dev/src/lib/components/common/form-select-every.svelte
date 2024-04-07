<script lang="ts">
  export let disabled = false;
  export let id: string;
  export let label: string;
  export let max = 100;
  export let min = 1;
  export let required = true;
  export let unit: string;
  export let value: number;

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
    {#each options as opt}
      <option value={opt}>{opt} {unit}{opt > 1 ? "s" : ""}</option>
    {/each}
  </select>
  <label for={id}>{label}</label>
</div>
