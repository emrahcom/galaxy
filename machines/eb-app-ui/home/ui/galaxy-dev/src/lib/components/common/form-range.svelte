<script lang="ts">
  interface Props {
    disabled?: boolean;
    label: string;
    max: number;
    min: number;
    name: string;
    onchange: (e: Event) => void;
    oninput: (e: InputEvent) => void;
    readonly?: boolean;
    required?: boolean;
    step: number;
    value: number;
  }

  let {
    disabled = false,
    label,
    max,
    min,
    name,
    onchange,
    oninput,
    readonly = false,
    required = false,
    step,
    value = $bindable(),
  }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating my-3">
  <input
    type="text"
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
    {oninput}
  />
  <label for={name}>{label}</label>
</div>

<input
  type="range"
  id="range-{name}"
  class="form-range"
  name="range-{name}"
  bind:value
  disabled={disabled || readonly}
  {min}
  {max}
  {step}
  tabindex={readonly ? -1 : undefined}
  {oninput}
/>
