<script lang="ts" context="module">
  import { getKratosLoad } from "$lib/kratos";
  import type { KratosLoad } from "$lib/kratos-types";

  export async function load(): Promise<KratosLoad> {
    return await getKratosLoad("settings");
  }
</script>

<!-- -------------------------------------------------------------------------->
<script lang="ts">
  import type { KratosForm, KratosError } from "$lib/kratos-types";
  import Form from "$lib/components/kratos/form.svelte";
  import Messages from "$lib/components/kratos/messages.svelte";

  export let dm: KratosForm | KratosError;

  if (dm.instanceOf === "KratosError") console.error(dm);
</script>

<!-- -------------------------------------------------------------------------->
<section class="container-fluid" id="settings">
  {#if dm.instanceOf === "KratosForm"}
    <div class="row justify-content-center">
      <div class="col text-center" style="max-width:540px;">
        <p class="h3 text-muted">Update your account settings</p>

        <Messages messages={dm.ui.messages} />
        <Form {dm} groups={["default", "profile"]} />

        <hr class="divider" />

        <Form {dm} groups={["default", "password"]} />
      </div>
    </div>
  {:else}
    <p class="text-center">Something went wrong</p>
  {/if}
</section>
