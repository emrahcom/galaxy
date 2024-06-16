<script lang="ts">
  export let hrefAdd = "";
  export let hrefBack = "";
  export let hrefCalendar = "";
  export let hrefMeeting = "";
  export let hrefNext = "";
  export let hrefPrevious = "";
  export let subheader = "";
</script>

<!-- -------------------------------------------------------------------------->
<section id="subheader">
  <div class="d-flex">
    <h3 class="text-muted my-auto" style="min-width:180px">{subheader}</h3>

    <div class="ms-4 me-auto my-auto">
      {#if hrefBack}
        <button
          class="btn btn-outline-secondary"
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
        on:click={() => {
          window.location.href = hrefAdd;
        }}
      >
        <span class="bi bi-plus-lg" />
      </button>
    {/if}
  </div>
</section>
