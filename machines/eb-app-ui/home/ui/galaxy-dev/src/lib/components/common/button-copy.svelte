<script lang="ts">
  interface Props {
    label?: string;
    onclick: (e: MouseEvent) => void;
  }

  const { label = "copy", onclick }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<button class="btn btn-sm btn-outline-primary" type="button" {onclick}>
  {label}
</button>
