<script lang="ts">
  import { getCalendarDay } from "$lib/common";
  export let today: string;
  export let firstDay: string;
  export let week: number;
  export let day: number;

  const focusedDay = getCalendarDay(firstDay, week, day);
  const dayOfMonth = Number(focusedDay.slice(-2));

  let bgColor = "";
  if (today === focusedDay) {
    bgColor = "bg-primary-subtle";
  } else if (focusedDay < today) {
    bgColor = "bg-light";
  }
</script>

<!-- -------------------------------------------------------------------------->
<div class="col h-100 p-0 {bgColor}">
  <div class="row mx-3">
    {dayOfMonth}
  </div>
</div>
