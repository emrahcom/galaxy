<script lang="ts">
  export let label: string;
  export let name: string;
  export let disabled = false;
  export let readonly = false;
  export let required = false;
  export let wrap = true;
  export let value: string;
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating my-3">
  <textarea
    id={name}
    class="form-control {wrap ? 'text-wrap' : 'text-nowrap'}"
    style="height: 128px"
    {name}
    placeholder=""
    bind:value
    {disabled}
    {readonly}
    {required}
    tabindex={disabled || readonly ? -1 : undefined}
  />
  <label for={name}>{label}</label>
</div>
