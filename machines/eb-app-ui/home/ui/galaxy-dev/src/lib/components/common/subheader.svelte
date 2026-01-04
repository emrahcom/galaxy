<script lang="ts">
  import { onMount } from "svelte";
  import { activateTooltips } from "$lib/common";

  interface Props {
    hrefAdd?: string;
    hrefAddTitle?: string;
    hrefBack?: string;
    hrefBackTitle?: string;
    hrefCalendar?: string;
    hrefCalendarTitle?: string;
    hrefContact?: string;
    hrefContactTitle?: string;
    hrefKey?: string;
    hrefKeyTitle?: string;
    hrefMeeting?: string;
    hrefMeetingTitle?: string;
    hrefNext?: string;
    hrefNextTitle?: string;
    hrefPrevious?: string;
    hrefPreviousTitle?: string;
    subheader?: string;
  }

  const {
    hrefAdd = "",
    hrefAddTitle = "Add",
    hrefBack = "",
    hrefBackTitle = "Go back",
    hrefCalendar = "",
    hrefCalendarTitle = "Calendar",
    hrefContact = "",
    hrefContactTitle = "Contacts",
    hrefKey = "",
    hrefKeyTitle = "Keys",
    hrefMeeting = "",
    hrefMeetingTitle = "Edit meetings",
    hrefNext = "",
    hrefNextTitle = "Next",
    hrefPrevious = "",
    hrefPreviousTitle = "Previous",
    subheader = "",
  }: Props = $props();

  onMount(() => {
    // unremovable tooltip's title issue if there is no delay
    setTimeout(activateTooltips, 200);
  });
</script>

<!-- -------------------------------------------------------------------------->
<section id="subheader">
  <div class="d-flex">
    <h3 class="text-muted my-auto" style="min-width:180px">{subheader}</h3>

    <div class="ms-3 me-auto my-auto">
      {#if hrefBack}
        <button
          class="btn btn-outline-secondary mx-1"
          data-bs-toggle="tooltip"
          data-bs-title={hrefBackTitle}
          aria-label={hrefBackTitle}
          onclick={() => {
            globalThis.location.href = hrefBack;
          }}
        >
          <i class="bi bi-arrow-return-left"></i>
        </button>
      {/if}

      {#if hrefContact}
        <button
          class="btn btn-outline-secondary"
          data-bs-toggle="tooltip"
          data-bs-title={hrefContactTitle}
          aria-label={hrefContactTitle}
          onclick={() => {
            globalThis.location.href = hrefContact;
          }}
        >
          <i class="bi bi-people"></i>
        </button>
      {/if}

      {#if hrefKey}
        <button
          class="btn btn-outline-secondary"
          data-bs-toggle="tooltip"
          data-bs-title={hrefKeyTitle}
          aria-label={hrefKeyTitle}
          onclick={() => {
            globalThis.location.href = hrefKey;
          }}
        >
          <i class="bi bi-key"></i>
        </button>
      {/if}

      {#if hrefMeeting}
        <button
          class="btn btn-outline-secondary"
          data-bs-toggle="tooltip"
          data-bs-title={hrefMeetingTitle}
          aria-label={hrefMeetingTitle}
          onclick={() => {
            globalThis.location.href = hrefMeeting;
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
          aria-label={hrefCalendarTitle}
          onclick={() => {
            globalThis.location.href = hrefCalendar;
          }}
        >
          <i class="bi bi-calendar3"></i>
        </button>
      {/if}

      {#if hrefPrevious}
        <button
          class="btn btn-outline-secondary ms-1 me-auto"
          data-bs-toggle="tooltip"
          data-bs-title={hrefPreviousTitle}
          aria-label={hrefPreviousTitle}
          onclick={() => {
            globalThis.location.href = hrefPrevious;
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
          aria-label={hrefNextTitle}
          onclick={() => {
            globalThis.location.href = hrefNext;
          }}
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      {/if}
    </div>

    {#if hrefAdd}
      <button
        class="btn btn-outline-secondary ms-auto me-0 my-auto"
        data-bs-toggle="tooltip"
        data-bs-title={hrefAddTitle}
        aria-label={hrefAddTitle}
        onclick={() => {
          globalThis.location.href = hrefAdd;
        }}
      >
        <i class="bi bi-plus-lg"></i>
      </button>
    {/if}
  </div>
</section>
