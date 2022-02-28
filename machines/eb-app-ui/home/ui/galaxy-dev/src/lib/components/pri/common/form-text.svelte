<script lang="ts">
  export let label: string;
  export let name: string;
  export let required: boolean;
  export let value: string;
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating my-3">
  <input
    type="text"
    id={name}
    class="form-control"
    {name}
    placeholder={label}
    {value}
    {required}
  />
  <label for={name}>{label}</label>
</div>
