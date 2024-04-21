<script lang="ts">
  import { page } from "$app/stores";
  import { today, toLocaleDate } from "$lib/common";
  import Subheader from "$lib/components/common/subheader.svelte";

  // validate date which comes from the path
  try {
    const date = toLocaleDate($page.params.date);

    if (date != $page.params.date) {
      window.location.href = `/pri/calendar/month/${date}`;
    }
  } catch {
    const date = today();
    window.location.href = `/pri/calendar/month/${date}`;
  }

  console.error($page.params.date);
</script>

<!-- -------------------------------------------------------------------------->
<Subheader subheader="My calendar" />

month
