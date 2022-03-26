<script lang="ts">
  export let label: string;
  export let name: string;
  export let readonly = false;
  export let required = false;
  export let value: string;
</script>

<!-- -------------------------------------------------------------------------->
<div class="form-floating my-3">
  <textarea
    id={name}
    class="form-control"
    style="height: 128px"
    {name}
    placeholder=""
    bind:value
    {readonly}
    {required}
    tabindex={readonly ? -1 : undefined}
  />
  <label for={name}>{label}</label>
</div>
