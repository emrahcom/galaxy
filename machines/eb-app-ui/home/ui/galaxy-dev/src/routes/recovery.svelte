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
  import Form from "$lib/components/form.svelte";

  export let dm: KratosForm | KratosError;

  if (dm.instanceOf === "KratosError") console.error(dm);
</script>

<!-- -------------------------------------------------------------------------->
{#if dm.instanceOf === "KratosForm"}
  <div class="container" id="recovery">
    <h2 class="subheading">recovery</h2>

    <Form {dm} groups={["default", "link"]} />
  </div>
{:else}
  <p>Something went wrong</p>
{/if}
