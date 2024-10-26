<script lang="ts">
  interface Props {
    label = "Click";
  }

  let { label }: Props = $props();
</script>

<!-- -------------------------------------------------------------------------->
<button class="btn btn-outline-secondary" type="button" on:click>
  {label}
</button>
