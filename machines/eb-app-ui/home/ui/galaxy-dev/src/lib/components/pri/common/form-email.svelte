<script lang="ts">
  export let label: string;
  export let name: string;
  export let readonly = false;
  export let required = false;
  export let value: string;
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating my-3">
  <input
    type="email"
    id={name}
    class="form-control"
    {name}
    placeholder={label}
    value={value ? value : ""}
    {readonly}
    {required}
  />
  <label for={name}>{label}</label>
</div>
