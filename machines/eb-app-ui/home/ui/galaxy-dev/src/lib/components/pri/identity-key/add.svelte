<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action, list } from "$lib/api";
  import type { Domain333 } from "$lib/types";
  import Cancel from "$lib/components/common/button-cancel.svelte";
  import Select from "$lib/components/common/form-select.svelte";
  import Submit from "$lib/components/common/button-submit.svelte";
  import SubmitBlocker from "$lib/components/common/button-submit-blocker.svelte";
  import Text from "$lib/components/common/form-text.svelte";
  import Warning from "$lib/components/common/alert-warning.svelte";

  const date = new Date();

  let warning = $state(false);
  let disabled = $state(false);
  let p = $state({
    name: `key-${date.getTime() % 10000000000}`,
    domain_id: "",
  });

  const pr = list("/api/pri/domain/list", 100).then((items: Domain333[]) => {
    const enableds = items
      .filter((i) => i.enabled)
      .sort((i, j) => (i.updated_at > j.updated_at ? -1 : 1));
    if (enableds[0]) p.domain_id = enableds[0].id;

    return items.map((i) => [
      i.id,
      `${i.name}${i.enabled ? "" : " - DISABLED"}`,
    ]);
  });

  // ---------------------------------------------------------------------------
  function cancel() {
    globalThis.location.href = "/pri/identity/key";
  }

  // ---------------------------------------------------------------------------
  async function onsubmit() {
    try {
      warning = false;
      disabled = true;

      await action("/api/pri/identity/key/add", p);
      globalThis.location.href = "/pri/identity/key";
    } catch {
      warning = true;
      disabled = false;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  {#await pr then domains}
    <div class="d-flex mt-2 justify-content-center">
      <form {onsubmit} style="width:{FORM_WIDTH};">
        <Text name="name" label="Name" bind:value={p.name} required={true} />
        <Select
          id="domain_id"
          label="Jitsi Domain"
          bind:value={p.domain_id}
          options={domains}
        />

        {#if warning}
          <Warning>
            The add request is not accepted. Please check your inputs.
          </Warning>
        {/if}

        <div class="d-flex gap-5 mt-5 justify-content-center">
          <Cancel {disabled} onclick={cancel} />
          <SubmitBlocker />
          <Submit {disabled} label="Add" />
        </div>
      </form>
    </div>
  {:catch}
    <Warning>Something went wrong</Warning>
  {/await}
</section>
