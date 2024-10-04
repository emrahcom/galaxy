<script lang="ts">
  export let label = "Cancel";
  export let disabled = false;
</script>

<!-- -------------------------------------------------------------------------->
<button class="btn btn-outline-secondary" type="button" {disabled} on:click>
  {label}
</button>
