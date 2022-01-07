<script lang="ts">
  import { getContext } from "svelte";
  import { APP } from "$lib/config";
  import type { KratosIdentity } from "$lib/kratos-types";

  const identity: KratosIdentity = getContext("identity");
</script>

<!-- -------------------------------------------------------------------------->
<h2>Advanced Control Panel</h2>
<p>Hello {identity.traits.email}</p>
<a href="{APP}/logout">Logout</a>
