<script lang="ts">
  interface Props {
    disabled?: boolean;
    label?: string;
  }

  let { disabled = false, label = "Submit" }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<button class="btn btn-outline-secondary" type="submit" {disabled}>
  {label}
</button>
