<script lang="ts">
  import { FORM_WIDTH } from "$lib/config";
  import { add as addDomain } from "$lib/pri/domain";
  import Cancel from "$lib/components/pri/common/button-cancel.svelte";
  import Submit from "$lib/components/pri/common/button-submit.svelte";
  import Text from "$lib/components/pri/common/form-text.svelte";
  import Warning from "$lib/components/pri/common/warning.svelte";

  export let warning = false;
  export let p = {
    name: "",
    auth_type: "none",
    auth_attr: {
      url: "",
      app_id: "",
      app_secret: "",
    },
  };

  function cancel() {
    window.location.href = "/pri/domain";
  }

  async function onSubmit() {
    try {
      warning = false;
      await addDomain(p);
      window.location.href = "/pri/domain";
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
      <Text
        name="url"
        label="URL"
        bind:value={p.auth_attr.url}
        required={true}
      />

      {#if p.auth_type === "token"}
        <Text
          name="app_id"
          label="App ID"
          bind:value={p.auth_attr.app_id}
          required={true}
        />
      {/if}

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
