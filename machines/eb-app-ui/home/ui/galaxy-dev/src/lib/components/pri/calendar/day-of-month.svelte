<script lang="ts">
  import {
    getCalendarDay,
    toLocaleDate,
    toLocaleTime,
    toLocaleMonthName,
  } from "$lib/common";
  import type { MeetingSchedule222 } from "$lib/types";

  export let calendarDay: string;
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

  let month = $state("");
  if (dayOfMonth === 1) month = toLocaleMonthName(focusedDay);

  let bgColor = $state("");
  if (today === focusedDay) {
    bgColor = "bg-primary-subtle";
  } else if (focusedDay < today) {
    bgColor = "bg-light";
  }

  // ---------------------------------------------------------------------------
  function generateHref(m: MeetingSchedule222) {
    if (m.membership_id) {
      return `/pri/member/waiting/${m.membership_id}#${calendarDay}`;
    } else {
      return `/pri/owner/waiting/${m.meeting_id}#${calendarDay}`;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<div class="col h-100 p-0 overflow-y-auto {bgColor}">
  <div class="row mx-1">{month} {dayOfMonth}</div>
  <div class="d-grid">
    {#each meetings as m}
      <a
        class="btn btn-sm btn-primary p-0 m-1 text-start text-nowrap overflow-x-hidden"
        href={generateHref(m)}
      >
        {toLocaleTime(m.started_at)}
        {m.meeting_name}
      </a>
    {/each}
  </div>
</div>
