<script lang="ts">
  import { MAX_WIDTH } from "$lib/config";

  export let msg: string;
</script>

<!-- -------------------------------------------------------------------------->
<section id="warning">
  <div class="row mx-auto mt-5" style="max-width:{MAX_WIDTH};">
    <div class="col text-center">
      <p class="text-danger">{msg}</p>
    </div>
  </div>
</section>
