<script lang="ts" context="module">
  import { getKratosLoad } from "$lib/kratos";
  import type { KratosLoad } from "$lib/kratos-types";

  export async function load(): Promise<KratosLoad> {
    return await getKratosLoad("registration");
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
<section class="container-fluid" id="registration">
  {#if dm.instanceOf === "KratosForm"}
    <div class="row justify-content-center">
      <div class="col text-center" style="max-width:540px;">
        <p class="h3 text-muted">Create your account</p>

        <Messages messages={dm.ui.messages} />
        <Form {dm} groups={["default", "password"]} />

        <hr class="divider" />

        <section class="alternative-actions">
          <p><a href="/login">Already have an account?</a></p>
        </section>
      </div>
    </div>
  {:else}
    <p class="text-center">Something went wrong</p>
  {/if}
</section>
