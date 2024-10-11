<script lang="ts">
  import type { IntercomMessage } from "$lib/types";

  export let notifications: IntercomMessage[];

  console.error(notifications);
</script>

<!-- -------------------------------------------------------------------------->
<div id="notifications" class="toast-container bottom-0 end-0 p-3"></div>
