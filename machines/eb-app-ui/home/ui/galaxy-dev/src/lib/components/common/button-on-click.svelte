<script lang="ts">
  interface Props {
    label?: string;
    onclick: (e: MouseEvent) => void;
  }

  let { label = "Click", onclick }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<button class="btn btn-outline-secondary" type="button" {onclick}>
  {label}
</button>
