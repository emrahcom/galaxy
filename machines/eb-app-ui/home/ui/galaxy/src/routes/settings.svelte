<script lang="ts" context="module">
  import { loadDataModels } from "$lib/kratos";
  import type { LoadOutput } from "$lib/custom-types";

  export async function load(): Promise<LoadOutput> {
    return await loadDataModels("settings");
  }
</script>

<!-- -------------------------------------------------------------------------->
<script lang="ts">
  import type { KratosForm, KratosError } from "$lib/kratos-types";
  import Form from "$lib/components/form.svelte";

  export let dm: KratosForm | KratosError;

  if (dm.instanceOf === "KratosError") console.error(dm);
</script>

<!-- -------------------------------------------------------------------------->
{#if dm.instanceOf === "KratosForm"}
  <div class="container" id="settings">
    <h2 class="subheading">Settings</h2>

    <Form {dm} groups={["default", "profile"]} />

    <hr class="divider" />

    <Form {dm} groups={["default", "password"]} disableGlobalMessages={true} />
  </div>
{:else}
  <p>Something went wrong</p>
{/if}
