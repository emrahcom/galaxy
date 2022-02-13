<script lang="ts" context="module">
  import { getKratosLoad } from "$lib/kratos";
  import type { KratosLoad } from "$lib/kratos-types";

  export async function load(): Promise<KratosLoad> {
    return await getKratosLoad("recovery");
  }
</script>

<!-- -------------------------------------------------------------------------->
<script lang="ts">
  import type { KratosForm, KratosError } from "$lib/kratos-types";
  import Form from "$lib/components/kratos/form.svelte";
  import Messages from "$lib/components/kratos/messages.svelte";

  export let dm: KratosForm | KratosError;
</script>

<!-- -------------------------------------------------------------------------->
<section class="container-fluid" id="recovery">
  {#if dm.instanceOf === "KratosForm"}
    <div class="row justify-content-center">
      <div class="col text-center" style="max-width:540px;">
        <p class="h3 text-muted">Forgot password?</p>
        <p class="small text-muted my-4 text-start">
          Enter the email address associated with your account and we will send
          you a link to reset your password.
        </p>

        {#if dm.ui.messages}
          <Messages messages={dm.ui.messages} />
        {:else}
          <Form {dm} groups={["default", "link"]} />
        {/if}
      </div>
    </div>
  {:else}
    <p class="text-center">Something went wrong</p>
  {/if}
</section>
