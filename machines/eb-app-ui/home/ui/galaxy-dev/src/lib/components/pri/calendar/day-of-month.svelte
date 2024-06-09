<script lang="ts">
  import { getCalendarDay } from "$lib/common";
  export let today: string;
  export let firstDay: string;
  export let week: number;
  export let day: number;

  const focusedDay = getCalendarDay(firstDay, week, day);

  let bgColor = "";
  if (today === focusedDay) {
    bgColor = "bg-primary-subtle";
  } else if (focusedDay < today) {
    bgColor = "bg-secondary-subtle";
  }
</script>

<!-- -------------------------------------------------------------------------->
<div class="col h-100 mx-3 {bgColor}">
  <div class="row">
    {week}-{day}
  </div>
</div>
