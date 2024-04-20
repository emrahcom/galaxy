<script lang="ts">
  export let hrefAdd = "";
  export let subheader = "";
</script>

<!-- -------------------------------------------------------------------------->
<section id="subheader">
  <div class="d-flex">
    <h3 class="text-muted my-auto">{subheader}</h3>

    {#if hrefAdd}
      <a
        class="btn btn-outline-secondary ms-auto me-2 my-auto"
        role="button"
        href={hrefAdd}
      >
        <span class="bi bi-plus-lg" />
      </a>
    {/if}
  </div>
</section>
