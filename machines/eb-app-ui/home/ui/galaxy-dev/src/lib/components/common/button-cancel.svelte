<script lang="ts">
  interface Props {
    disabled?: string;
    label?: string;
  }

  let { disabled = false, label = "Cancel" }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<button class="btn btn-outline-secondary" type="button" {disabled} on:click>
  {label}
</button>
