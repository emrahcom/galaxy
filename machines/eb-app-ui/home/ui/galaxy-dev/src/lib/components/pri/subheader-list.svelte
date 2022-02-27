<script lang="ts">
  import { MAX_WIDTH } from "$lib/config";

  export let href: string;
  export let subheader: string;
</script>

<!-- -------------------------------------------------------------------------->
<section id="subheader">
  <div
    class="row mx-auto border-bottom border-3"
    style="max-width:{MAX_WIDTH};"
  >
    <div class="col my-auto">
      <h3 class="text-muted">{subheader}</h3>
    </div>
    <div class="col text-end my-3">
      <a class="btn btn-outline-secondary" role="button" {href}>
        <span class="bi bi-plus-lg" />
      </a>
    </div>
  </div>
</section>
