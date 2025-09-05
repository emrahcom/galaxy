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
  <textarea
    id={name}
    class="form-control"
    style="height: 128px; white-space: pre-wrap"
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
