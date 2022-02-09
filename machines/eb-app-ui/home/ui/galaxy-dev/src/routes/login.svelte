<script lang="ts" context="module">
  import { getKratosLoad } from "$lib/kratos";
  import type { KratosLoad } from "$lib/kratos-types";

  export async function load(): Promise<KratosLoad> {
    return await getKratosLoad("login");
  }
</script>

<!-- -------------------------------------------------------------------------->
<script lang="ts">
  import { APP } from "$lib/config";
  import type { KratosForm, KratosError } from "$lib/kratos-types";
  import Form from "$lib/components/kratos/form.svelte";
  import MessagesGlobal from "$lib/components/kratos/messages-global.svelte";

  export let dm: KratosForm | KratosError;

  if (dm.instanceOf === "KratosError") console.error(dm);
</script>

<!-- -------------------------------------------------------------------------->
<section class="container-fluid" id="login">
  {#if dm.instanceOf === "KratosForm"}
    <div class="row justify-content-center">
      <div class="col text-center" style="max-width:540px;">
        <p class="h3 text-muted">Sign in to your account</p>
        <MessagesGlobal messages={dm.ui.messages} />
        <Form {dm} groups={["default", "password"]} />

        <hr class="divider" />

        <section class="alternative-actions">
          <a href="{APP}/recovery">Forgot Password?</a>
          <a href="{APP}/registration">Don't have an account?</a>
        </section>
      </div>
    </div>
  {:else}
    <p>Something went wrong</p>
  {/if}
</section>
