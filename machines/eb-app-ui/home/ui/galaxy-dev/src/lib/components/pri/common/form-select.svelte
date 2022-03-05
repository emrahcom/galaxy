<script lang="ts">
  export let disabled = false;
  export let label: string;
  export let options: string[][];
  export let value: string;
</script>

<!-- -------------------------------------------------------------------------->
<select class="form-select" bind:value aria-label={label} {disabled}>
  <option selected>{label}</option>

  {#each options as opt}
    <option value={opt[0]}>{opt[1]}</option>
  {/each}
</select>
