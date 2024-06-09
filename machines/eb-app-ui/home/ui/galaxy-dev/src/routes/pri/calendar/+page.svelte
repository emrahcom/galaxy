<script lang="ts">
  import { getToday } from "$lib/common";

  const date = getToday();

  window.location.href = `/pri/calendar/month/${date}`;
</script>
