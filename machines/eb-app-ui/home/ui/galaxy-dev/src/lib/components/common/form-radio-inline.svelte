<script lang="ts">
  interface Props {
    disabled?: boolean;
    options: string[][];
    value: string;
  }

  let { disabled = false, options, value = $bindable() }: Props = $props();
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
