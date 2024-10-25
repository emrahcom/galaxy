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
  <textarea
    id={name}
    class="form-control"
    style="height: 128px; white-space: pre"
    {name}
    placeholder=""
    bind:value
    {disabled}
    {readonly}
    {required}
    tabindex={disabled || readonly ? -1 : undefined}
  ></textarea>
  <label for={name}>{label}</label>
</div>
