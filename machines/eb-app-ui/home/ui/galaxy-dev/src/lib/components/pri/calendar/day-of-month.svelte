<script lang="ts">
  import { getCalendarDay, toLocaleDate, toLocaleMonthName } from "$lib/common";
  import type { MeetingSchedule222 } from "$lib/types";

  export let today: string;
  export let firstDay: string;
  export let week: number;
  export let day: number;
  export let calendar: MeetingSchedule222[];

  const focusedDay = getCalendarDay(firstDay, week, day);
  const dayOfMonth = Number(focusedDay.slice(-2));
  const meetings = calendar.filter(
    (m) => focusedDay === toLocaleDate(m.started_at),
  );

  console.error(meetings);

  let month = "";
  if (dayOfMonth === 1) month = toLocaleMonthName(focusedDay);

  let bgColor = "";
  if (today === focusedDay) {
    bgColor = "bg-primary-subtle";
  } else if (focusedDay < today) {
    bgColor = "bg-light";
  }
</script>

<!-- -------------------------------------------------------------------------->
<div class="col h-100 p-0 {bgColor}">
  <div class="row mx-1">{month} {dayOfMonth}</div>
</div>
