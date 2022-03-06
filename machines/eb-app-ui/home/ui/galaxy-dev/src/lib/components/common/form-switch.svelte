<script lang="ts">
  export let disabled = false;
  export let label: string;
  export let name: string;
  export let value: boolean;
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-check form-switch">
  <input
    class="form-check-input"
    type="checkbox"
    role="switch"
    id={name}
    bind:checked={value}
    {disabled}
  />
  <label class="form-check-label" for={name}>{label}</label>
</div>
