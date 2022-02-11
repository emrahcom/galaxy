<script lang="ts">
  import { getContext } from "svelte";
  import type { KratosIdentity } from "$lib/kratos-types";

  const identity: KratosIdentity = getContext("identity");
</script>

<!-- -------------------------------------------------------------------------->
<h2>Dashboard</h2>
<p>Hello {identity.traits.email}</p>
