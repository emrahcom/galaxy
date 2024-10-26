<script lang="ts">
  interface Props {
    label?: string;
  }

  let { label = "Click" }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<button class="btn btn-outline-secondary" type="button" on:click>
  {label}
</button>
