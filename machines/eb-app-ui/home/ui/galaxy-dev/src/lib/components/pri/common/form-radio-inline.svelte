<script lang="ts">
  export let disabled = false;
  export let options: string[][];
  export let value: string;
</script>

<!-- -------------------------------------------------------------------------->
{#each options as opt}
  <div class="form-check form-check-inline">
    <input
      class="form-check-input"
      type="radio"
      bind:group={value}
      id={opt[0]}
      value={opt[0]}
      {disabled}
    />
    <label class="form-check-label" for={opt[0]}>{opt[1]}</label>
  </div>
{/each}
