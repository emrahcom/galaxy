<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { action } from "$lib/pri/api";
  import Cancel from "$lib/components/pri/common/button-cancel.svelte";
  import Select from "$lib/components/pri/common/form-select.svelte";
  import Submit from "$lib/components/pri/common/button-submit.svelte";
  import Switch from "$lib/components/pri/common/form-switch.svelte";
  import Text from "$lib/components/pri/common/form-text.svelte";
  import Warning from "$lib/components/pri/common/warning.svelte";

  let warning = false;
  let p = {
    name: "",
    domain_id: "",
    has_suffix: false,
  };

  function cancel() {
    window.location.href = "/pri/room";
  }

  async function onSubmit() {
    try {
      warning = false;
      await action("/api/pri/room/add", p);
      window.location.href = "/pri/room";
    } catch {
      warning = true;
    }
  }
</script>

<!-- -------------------------------------------------------------------------->
<section id="add">
  <div class="d-flex mt-2 justify-content-center">
    <form on:submit|preventDefault={onSubmit} style="width:{FORM_WIDTH};">
      <Text name="name" label="Name" bind:value={p.name} required={true} />
      <Select
        id="domain_id"
        label="Jitsi domain"
        bind:value={p.domain_id}
        options={[]}
      />
      <Switch
        name="has_suffix"
        label="Enable unpredictable room name generator"
        bind:value={p.has_suffix}
      />

      {#if warning}
        <Warning>
          The add request is not accepted. Please check your inputs.
        </Warning>
      {/if}

      <div class="d-flex gap-5 mt-5 justify-content-center">
        <Cancel on:click={cancel} />
        <Submit label="Add" />
      </div>
    </form>
  </div>
</section>
