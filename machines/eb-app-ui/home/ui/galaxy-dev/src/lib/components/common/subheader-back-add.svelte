<script lang="ts">
  export let hrefAdd: string;
  export let hrefBack: string;
  export let subheader: string;
</script>

<!-- -------------------------------------------------------------------------->
<section id="subheader">
  <div class="d-flex">
    <h3 class="text-muted my-auto">
      {subheader}

      <a
        class="btn btn-lg btn-outline-secondary border-0 ms-auto me-2 my-auto"
        role="button"
        href={hrefBack}
      >
        <span class="bi bi-arrow-return-left" />
      </a>
    </h3>

    <a
      class="btn btn-outline-secondary ms-auto me-2 my-auto"
      role="button"
      href={hrefAdd}
    >
      <span class="bi bi-plus-lg" />
    </a>
  </div>
</section>
