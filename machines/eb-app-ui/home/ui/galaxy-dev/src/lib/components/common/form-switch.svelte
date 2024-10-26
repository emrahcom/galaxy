<script lang="ts">
  interface Props {
    desc?: string;
    disabled?: boolean;
    label: string;
    name: string;
    value: boolean;
  }

  let {
    desc = "",
    disabled = false,
    label,
    name,
    value = $bindable(),
  }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-check form-switch">
  <input
    class="form-check-input"
    type="checkbox"
    role="switch"
    id={name}
    bind:checked={value}
    aria-checked={value}
    {disabled}
  />
  <label class="form-check-label" for={name}>{label}</label>
  <em class="text-muted small">{desc}</em>
</div>
