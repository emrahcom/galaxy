<script lang="ts">
  import { onMount } from "svelte";
  import { activateTooltips } from "$lib/common";

  export let hrefAdd = "";
  export let hrefAddTitle = "Add";
  export let hrefBack = "";
  export let hrefBackTitle = "Go back";
  export let hrefCalendar = "";
  export let hrefCalendarTitle = "Calendar";
  export let hrefMeeting = "";
  export let hrefMeetingTitle = "Edit meetings";
  export let hrefNext = "";
  export let hrefNextTitle = "Next";
  export let hrefPrevious = "";
  export let hrefPreviousTitle = "Previous";
  export let subheader = "";

  onMount(() => {
    // unremovable tooltip's title issue if there is no delay
    setTimeout(activateTooltips, 200);
  });
</script>

<!-- -------------------------------------------------------------------------->
<section id="subheader">
  <div class="d-flex">
    <h3 class="text-muted my-auto" style="min-width:180px">{subheader}</h3>

    <div class="ms-4 me-auto my-auto">
      {#if hrefBack}
        <button
          class="btn btn-outline-secondary"
          data-bs-toggle="tooltip"
          data-bs-title={hrefBackTitle}
          on:click={() => {
            window.location.href = hrefBack;
          }}
        >
          <i class="bi bi-arrow-return-left"></i>
        </button>
      {/if}

      {#if hrefMeeting}
        <button
          class="btn btn-outline-secondary"
          data-bs-toggle="tooltip"
          data-bs-title={hrefMeetingTitle}
          on:click={() => {
            window.location.href = hrefMeeting;
          }}
        >
          <i class="bi bi-pencil"></i>
        </button>
      {/if}

      {#if hrefCalendar}
        <button
          class="btn btn-outline-secondary"
          data-bs-toggle="tooltip"
          data-bs-title={hrefCalendarTitle}
          on:click={() => {
            window.location.href = hrefCalendar;
          }}
        >
          <i class="bi bi-calendar3"></i>
        </button>
      {/if}

      {#if hrefPrevious}
        <button
          class="btn btn-outline-secondary ms-3 me-auto"
          data-bs-toggle="tooltip"
          data-bs-title={hrefPreviousTitle}
          on:click={() => {
            window.location.href = hrefPrevious;
          }}
        >
          <i class="bi bi-chevron-left"></i>
        </button>
      {/if}

      {#if hrefNext}
        <button
          class="btn btn-outline-secondary"
          data-bs-toggle="tooltip"
          data-bs-title={hrefNextTitle}
          on:click={() => {
            window.location.href = hrefNext;
          }}
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      {/if}
    </div>

    {#if hrefAdd}
      <button
        class="btn btn-outline-secondary ms-auto me-2 my-auto"
        data-bs-toggle="tooltip"
        data-bs-title={hrefAddTitle}
        on:click={() => {
          window.location.href = hrefAdd;
        }}
      >
        <i class="bi bi-plus-lg"></i>
      </button>
    {/if}
  </div>
</section>
