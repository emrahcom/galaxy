<script lang="ts">
  interface Props {
    disabled?: boolean;
    label?: string;
    onclick: (e: MouseEvent) => void;
  }

  let { disabled = false, label = "Cancel", onclick }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<button class="btn btn-outline-secondary" type="button" {disabled} {onclick}>
  {label}
</button>
