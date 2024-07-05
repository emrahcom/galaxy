<script lang="ts">
  export let href: string;
  export let title = "Delete";
</script>

<!-- -------------------------------------------------------------------------->
<a
  {href}
  class="btn btn-outline-dark btn-sm"
  role="button"
  data-bs-toggle="tooltip"
  data-bs-title={title}
>
  <i class="bi bi-trash" />
</a>
