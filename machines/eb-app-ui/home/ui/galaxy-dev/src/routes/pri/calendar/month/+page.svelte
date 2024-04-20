<script lang="ts">
  import { today } from "$lib/common";

  const date = today();

  window.location.href = "/pri/calendar/month/${date}";
</script>
