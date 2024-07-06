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
          <span class="bi bi-arrow-return-left" />
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
          <span class="bi bi-pencil" />
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
          <span class="bi bi-calendar3" />
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
          <span class="bi bi-chevron-left" />
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
          <span class="bi bi-chevron-right" />
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
        <span class="bi bi-plus-lg" />
      </button>
    {/if}
  </div>
</section>
