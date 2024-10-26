<script lang="ts">
  interface Props {
    label?: string;
  }

  let { label = "copy" }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<button class="btn btn-sm btn-outline-primary" type="button" on:click>
  {label}
</button>
