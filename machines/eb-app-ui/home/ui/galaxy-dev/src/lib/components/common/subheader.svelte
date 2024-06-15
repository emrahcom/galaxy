<script lang="ts">
  export let hrefAdd = "";
  export let hrefBack = "";
  export let hrefCalendar = "";
  export let subheader = "";
</script>

<!-- -------------------------------------------------------------------------->
<section id="subheader">
  <div class="d-flex">
    <h3 class="text-muted my-auto">{subheader}</h3>

    {#if hrefBack}
      <a
        class="btn btn-outline-secondary ms-4 me-auto my-auto"
        role="button"
        href={hrefBack}
      >
        <span class="bi bi-arrow-return-left" />
      </a>
    {/if}

    {#if hrefCalendar}
      <a
        class="btn btn-outline-secondary ms-4 me-auto my-auto"
        role="button"
        href={hrefCalendar}
      >
        <span class="bi bi-calendar3" />
      </a>
    {/if}

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
