<script lang="ts">
  interface Props {
    label?: string;
  }

  let { label = "copy" }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<button class="btn btn-sm btn-outline-primary" type="button" onclick>
  {label}
</button>
