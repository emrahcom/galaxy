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

  export let dm: KratosForm | KratosError;

  if (dm.instanceOf === "KratosError") console.error(dm);
</script>

<!-- -------------------------------------------------------------------------->
{#if dm.instanceOf === "KratosForm"}
  <div class="container" id="settings">
    <h2 class="subheading">Settings</h2>

    <Form {dm} groups={["default", "profile"]} />

    <hr class="divider" />

    <!-- <Form {dm} groups={["default", "password"]}
      disableGlobalMessages={true} /> -->
    <Form {dm} groups={["default", "password"]} />
  </div>
{:else}
  <p>Something went wrong</p>
{/if}
