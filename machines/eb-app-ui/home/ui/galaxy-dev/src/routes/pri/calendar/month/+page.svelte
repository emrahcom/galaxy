<script lang="ts">
  import { getToday } from "$lib/common";

  const date = getToday();

  globalThis.location.href = `/pri/calendar/month/${date}`;
</script>
