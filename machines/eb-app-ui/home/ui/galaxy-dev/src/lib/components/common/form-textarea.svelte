<script lang="ts">
  export let label: string;
  export let name: string;
  export let readonly = false;
  export let required = false;
  export let row = 3;
  export let value: string;
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating my-3">
  <textarea
    id={name}
    class="form-control"
    {name}
    placeholder=""
    bind:value
    {readonly}
    {required}
    {row}
  />
  <label for={name}>{label}</label>
</div>
