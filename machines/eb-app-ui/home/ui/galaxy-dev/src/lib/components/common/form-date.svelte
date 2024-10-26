<script lang="ts">
  interface Props {
    disabled?: boolean;
    label: string;
    min?: string;
    name: string;
    readonly?: boolean;
    required?: boolean;
    value: string;
  }

  let {
    disabled = false,
    label,
    min = "2020-01-01",
    name,
    readonly = false,
    required = false,
    value = $bindable(),
  }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating my-3">
  <input
    type="date"
    id={name}
    class="form-control"
    {name}
    placeholder=""
    bind:value
    {min}
    {disabled}
    {readonly}
    {required}
    tabindex={disabled || readonly ? -1 : undefined}
  />
  <label for={name}>{label}</label>
</div>
