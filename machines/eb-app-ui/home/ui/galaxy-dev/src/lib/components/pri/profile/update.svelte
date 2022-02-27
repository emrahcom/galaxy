<script lang="ts">
  import { MAX_WIDTH } from "$lib/config";
  import type { Profile } from "$lib/types";

  export let p: Profile;
</script>

<!-- -------------------------------------------------------------------------->
<section id="update">
  <div class="row mx-auto mt-2 g-2" style="max-width:{MAX_WIDTH};">
    <p>{p.id}</p>
    <p>{p.name}</p>
    <p>{p.email}</p>
  </div>
</section>
