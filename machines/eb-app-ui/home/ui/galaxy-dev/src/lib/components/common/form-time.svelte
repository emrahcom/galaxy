<script lang="ts">
  interface Props {
    disabled?: boolean;
    label: string;
    name: string;
    readonly?: boolean;
    required?: boolean;
    value: string;
  }

  let {
    disabled = false,
    label,
    name,
    readonly = false,
    required = false,
    value = $bindable(),
  }: Props = $props();
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
