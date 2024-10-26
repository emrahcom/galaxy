<script lang="ts">
  interface Props {
    label = "copy";
  }

  let { label }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<button class="btn btn-sm btn-outline-primary" type="button" on:click>
  {label}
</button>
