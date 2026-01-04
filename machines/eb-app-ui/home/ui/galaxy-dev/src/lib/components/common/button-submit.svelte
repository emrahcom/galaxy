<script lang="ts">
  interface Props {
    disabled?: boolean;
    label?: string;
  }

  const { disabled = false, label = "Submit" }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<button class="btn btn-outline-secondary" type="submit" {disabled}>
  {label}
</button>
