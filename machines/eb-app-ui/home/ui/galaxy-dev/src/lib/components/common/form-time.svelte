<script lang="ts">
  interface Props {
    disabled?: boolean;
    label: string;
    name: string;
    onchange: (e: Event) => void;
    readonly?: boolean;
    required?: boolean;
    value: string;
  }

  let {
    disabled = false,
    label,
    name,
    onchange,
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
    {onchange}
  />
  <label for={name}>{label}</label>
</div>
