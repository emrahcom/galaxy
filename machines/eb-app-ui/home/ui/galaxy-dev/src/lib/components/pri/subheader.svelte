<script lang="ts">
  import { MAX_WIDTH } from "$lib/config";

  export let subheader: string;
</script>

<!-- -------------------------------------------------------------------------->
<section id="subheader">
  <div
    class="row mx-auto border-bottom border-3"
    style="max-width:{MAX_WIDTH}px;"
  >
    <div class="col my-auto">
      <h3 class="text-muted">{subheader}</h3>
    </div>
  </div>
</section>
