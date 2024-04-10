<script lang="ts">
  export let disabled = false;
  export let label: string;
  export let name: string;
  export let value: boolean;
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-check">
  <input
    class="form-check-input"
    type="checkbox"
    id={name}
    bind:checked={value}
    aria-checked={value}
    {disabled}
  />
  <label class="form-check-label" for={name}>{label}</label>
</div>
