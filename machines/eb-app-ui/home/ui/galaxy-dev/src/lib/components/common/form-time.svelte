<script lang="ts">
  export let label: string;
  export let name: string;
  export let disabled = false;
  export let readonly = false;
  export let required = false;
  export let value: string;
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating my-3">
  <input
    type="time"
    id={name}
    class="form-control"
    {name}
    placeholder=""
    bind:value
    {disabled}
    {readonly}
    {required}
    tabindex={disabled || readonly ? -1 : undefined}
    on:change
  />
  <label for={name}>{label}</label>
</div>
