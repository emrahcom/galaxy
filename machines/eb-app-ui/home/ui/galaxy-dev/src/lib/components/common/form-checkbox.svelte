<script lang="ts">
  interface Props {
    disabled?: boolean;
    label: string;
    name: string;
    value: boolean;
  }

  let { disabled = false, label, name, value = $bindable() }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-check mx-auto">
  <input
    class="form-check-input"
    type="checkbox"
    id={name}
    bind:checked={value}
    aria-checked={value}
    {disabled}
  />
  <label class="form-check-label" for={name}>{label}</label>
</div>
