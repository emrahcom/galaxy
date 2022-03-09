<script lang="ts">
  export let disabled = false;
  export let id: string;
  export let label: string;
  export let options: string[][];
  export let required = true;
  export let value: string;
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
    <option class="bg-body" />

    {#each options as opt}
      <option value={opt[0]}>{opt[1]}</option>
    {/each}
  </select>
  <label for={id}>{label}</label>
</div>
