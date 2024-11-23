<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import type { Phone111 } from "$lib/types";
  import Call from "$lib/components/common/button-on-click.svelte";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  interface Props {
    p: Phone111;
  }

  let { p }: Props = $props();

  let warning = $state(false);

  // ---------------------------------------------------------------------------
  function goHome() {
    globalThis.location.href = `/`;
  }

  // ---------------------------------------------------------------------------
  async function call(code: string) {
    try {
      warning = false;
      console.error(code);
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="call">
  <div class="d-flex mt-2 justify-content-center">
    <div class="card border-0 mx-auto" style="max-width:{FORM_WIDTH};">
      <div class="card-body text-center">
        <h2 class="card-title text-muted bg-light mt-2 mb-3 py-3">call</h2>

        <div
          class="card-footer d-flex justify-content-center bg-body border-0
          mt-3 gap-5"
        >
          <Cancel label="Cancel" onclick={goHome} />

          <Call
            label="Call"
            onclick={() => {
              call(p.code);
            }}
          />
        </div>
      </div>
    </div>

    {#if warning}
      <Warning>The call request is not accepted.</Warning>
    {/if}
  </div>
</section>
